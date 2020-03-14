import { Card, Typography } from 'antd';
import { Deployment as DeploymentData } from '../../../queries';
import DeleteDeployment from './DeleteDeployment';

type Props = {
    deployment: Pick<DeploymentData, 'id' | 'image'>;
};

export default function Container({ deployment }: Props) {
    return (
        <Card size="small">
            <Typography.Text code>{deployment.image}</Typography.Text>
            <DeleteDeployment id={deployment.id} />
        </Card>
    );
}