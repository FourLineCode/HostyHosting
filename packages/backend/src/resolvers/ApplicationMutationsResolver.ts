import { ObjectType, Field, Arg, Mutation, Int, Ctx, Authorized } from 'type-graphql';
import { Application } from '../entity/Application';
import { Component } from '../entity/Component';
import { Context } from '../types';
import { OrganizationPermission } from '../entity/OrganizationMembership';
import { ComponentInput } from './types/ComponentInput';
import { ApplicationInput } from './types/ApplicationInput';
import { ContainerGroup } from '../entity/ContainerGroup';
import { Environment } from '../entity/Environment';
import { Secret } from '../entity/Secret';
import { ContainerGroupInput } from './types/ContainerGroupInput';

@ObjectType()
export class ApplicationMutations {
    application: Application;

    constructor(application: Application) {
        this.application = application;
    }

    // TODO: This needs to delete all associated resources. (cascasde should solve this)
    @Field(() => Application)
    async delete() {
        // TODO: Spin down all resources, and instead of immedietly deleting, mark
        // it in a state of deletion, and don't allow modification to the model.
        await Application.delete(this.application.id);

        return this.application;
    }

    @Field(() => Application)
    async update(@Arg('application', () => ApplicationInput) applicationInput: ApplicationInput) {
        if (typeof applicationInput.name !== 'undefined' && applicationInput.name !== null) {
            this.application.name = applicationInput.name;
        }

        if (
            typeof applicationInput.description !== 'undefined' &&
            applicationInput.description !== null
        ) {
            this.application.description = applicationInput.description;
        }

        return await this.application.save();
    }

    @Field(() => Component)
    async createComponent(@Arg('component', () => ComponentInput) componentInput: ComponentInput) {
        const component = new Component();
        component.application = this.application;
        component.name = componentInput.name;
        component.image = componentInput.image;
        component.deploymentStrategy = componentInput.deploymentStrategy;

        return await component.save();
    }

    @Field(() => ContainerGroup)
    async createContainerGroup(
        @Arg('containerGroup', () => ContainerGroupInput) containerGroupInput: ContainerGroupInput,
    ) {
        const organization = await this.application.organization;

        const component = await Component.findOneOrFail({
            where: {
                id: containerGroupInput.componentID,
                application: this.application,
            },
        });

        const environment = await Environment.findOneOrFail({
            where: {
                id: containerGroupInput.environmentID,
                organization,
            },
        });

        const containerGroup = new ContainerGroup();
        containerGroup.environment = environment;
        containerGroup.organization = organization;
        containerGroup.component = component;
        containerGroup.setSize(containerGroupInput.size);
        containerGroup.setContainerCount(containerGroupInput.containerCount);

        return await containerGroup.save();
    }

    @Field(() => Component)
    async updateComponent(
        @Arg('id', () => Int) id: number,
        @Arg('component', () => ComponentInput) componentInput: ComponentInput,
    ) {
        const component = await Component.findByApplicationAndId(this.application, id);

        if ('name' in componentInput) {
            component.name = componentInput.name;
        }

        if ('image' in componentInput) {
            component.image = componentInput.image;
        }

        if ('deploymentStrategy' in componentInput) {
            component.deploymentStrategy = componentInput.deploymentStrategy;
        }

        return await component.save();
    }

    @Field(() => Secret)
    async addSecret(
        @Arg('containerGroup', () => Int) containerGroupID: number,
        @Arg('key') key: string,
        @Arg('value') value: string,
    ) {
        // TODO: This is not really secure because we don't scope the container group lookup.
        // Instead, at some point in the future we need to move all of the containerGroup mutations into a ContainerGroupMutationsResolver.
        const containerGroup = await ContainerGroup.findOneOrFail(containerGroupID);

        const secret = new Secret();

        secret.key = key;
        secret.value = value;
        secret.containerGroup = containerGroup;

        return await secret.save();
    }

    @Field(() => Secret)
    async editSecret(
        @Arg('containerGroup', () => Int) containerGroupID: number,
        @Arg('id', () => Int) id: number,
        @Arg('key') key: string,
        @Arg('value') value: string,
    ) {
        const secret = await Secret.findOneOrFail({
            where: {
                id,
                containerGroup: {
                    id: containerGroupID,
                },
            },
        });

        secret.key = key;
        secret.value = value;

        return await secret.save();
    }

    @Field(() => Secret)
    async deleteSecret(
        @Arg('containerGroup', () => Int) containerGroupID: number,
        @Arg('id', () => Int) id: number,
    ) {
        const secret = await Secret.findOneOrFail({
            where: {
                id,
                containerGroup: {
                    id: containerGroupID
                },
            },
        });

        await Secret.delete(secret.id);

        return secret;
    }

    @Field(() => Component)
    async deleteComponent(@Arg('id', () => Int) id: number) {
        const deployment = await Component.findByApplicationAndId(this.application, id);
        await Component.delete(deployment.id);
        return deployment;
    }
}

export class ApplicationMutationsResolver {
    @Authorized()
    @Mutation(() => ApplicationMutations)
    async application(@Ctx() { user }: Context, @Arg('id', () => Int) id: number) {
        const application = await Application.findOneOrFail({
            where: {
                id,
            },
        });

        // Ensure the current user has permission to this application.
        // All application mutations require AT LEAST write access to the organization.
        await application.userHasPermission(user, OrganizationPermission.WRITE);

        return new ApplicationMutations(application);
    }
}
