export interface IStatus {
    designation: string;
    uuid: string;
    code: string;
}

export const STCodeList = {
    'ACTIVE': 'ACT',
    'DELETED': 'DLT',
    'COMPLETED': 'CMP',
    'OUTSTANDING': 'OSD',
} as const;

export type TStatus = (typeof STCodeList)[keyof typeof STCodeList];
