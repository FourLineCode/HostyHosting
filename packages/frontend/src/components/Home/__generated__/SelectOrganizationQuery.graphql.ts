/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from "relay-runtime";
export type SelectOrganizationQueryVariables = {
    organization: string;
};
export type SelectOrganizationQueryResponse = {
    readonly viewer: {
        readonly id: string;
        readonly personalOrganization: {
            readonly id: string;
            readonly username: string;
        };
        readonly organizations: ReadonlyArray<{
            readonly id: string;
            readonly name: string;
            readonly username: string;
        }>;
    };
    readonly organization: {
        readonly id: string;
        readonly name: string;
        readonly username: string;
        readonly isPersonal: boolean;
        readonly memberCount: number;
    };
};
export type SelectOrganizationQuery = {
    readonly response: SelectOrganizationQueryResponse;
    readonly variables: SelectOrganizationQueryVariables;
};



/*
query SelectOrganizationQuery(
  $organization: String!
) {
  viewer {
    id
    personalOrganization {
      id
      username
    }
    organizations {
      id
      name
      username
    }
  }
  organization(username: $organization) {
    id
    name
    username
    isPersonal
    memberCount
  }
}
*/

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "organization"
  }
],
v1 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
},
v2 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "username",
  "storageKey": null
},
v3 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "name",
  "storageKey": null
},
v4 = [
  {
    "alias": null,
    "args": null,
    "concreteType": "User",
    "kind": "LinkedField",
    "name": "viewer",
    "plural": false,
    "selections": [
      (v1/*: any*/),
      {
        "alias": null,
        "args": null,
        "concreteType": "Organization",
        "kind": "LinkedField",
        "name": "personalOrganization",
        "plural": false,
        "selections": [
          (v1/*: any*/),
          (v2/*: any*/)
        ],
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "concreteType": "Organization",
        "kind": "LinkedField",
        "name": "organizations",
        "plural": true,
        "selections": [
          (v1/*: any*/),
          (v3/*: any*/),
          (v2/*: any*/)
        ],
        "storageKey": null
      }
    ],
    "storageKey": null
  },
  {
    "alias": null,
    "args": [
      {
        "kind": "Variable",
        "name": "username",
        "variableName": "organization"
      }
    ],
    "concreteType": "Organization",
    "kind": "LinkedField",
    "name": "organization",
    "plural": false,
    "selections": [
      (v1/*: any*/),
      (v3/*: any*/),
      (v2/*: any*/),
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "isPersonal",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "memberCount",
        "storageKey": null
      }
    ],
    "storageKey": null
  }
];
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "SelectOrganizationQuery",
    "selections": (v4/*: any*/),
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "SelectOrganizationQuery",
    "selections": (v4/*: any*/)
  },
  "params": {
    "cacheID": "867567c56d4858299b09555b726dc3c8",
    "id": null,
    "metadata": {},
    "name": "SelectOrganizationQuery",
    "operationKind": "query",
    "text": "query SelectOrganizationQuery(\n  $organization: String!\n) {\n  viewer {\n    id\n    personalOrganization {\n      id\n      username\n    }\n    organizations {\n      id\n      name\n      username\n    }\n  }\n  organization(username: $organization) {\n    id\n    name\n    username\n    isPersonal\n    memberCount\n  }\n}\n"
  }
};
})();
(node as any).hash = '08ca8e69d2dff27b7fe4cb7c4983b551';
export default node;
