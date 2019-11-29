export class SortTypes{
    sortTypeValue: string;
    sortTypeName: string;
}

export const SortTypeList: SortTypes [] = [
    {
        sortTypeValue: 'sitenameasc',
        sortTypeName: 'Sort By: Site name A-Z'
    },
    {
        sortTypeValue: 'sitenamedesc',
        sortTypeName: 'Site name Z-A'
    },
    {
        sortTypeValue: 'servernamedesc',
        sortTypeName: 'Server name Z-A'
    },
    {
        sortTypeValue: 'servernameasc',
        sortTypeName: 'Server name A-Z'
    },
    {
        sortTypeValue: 'siteidasc',
        sortTypeName: 'Site Id A-Z'
    },
    {
        sortTypeValue: 'siteiddesc',
        sortTypeName: 'Site Id Z-A'
    },
    {
        sortTypeValue: 'statusdesc',
        sortTypeName: 'Status green to red'
    },
    {
        sortTypeValue: 'statusasc',
        sortTypeName: 'Status red to green'
    }];