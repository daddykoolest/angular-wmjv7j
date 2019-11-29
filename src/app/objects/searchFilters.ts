export class Filters {
    filterDisplayName: string;
    filterName: string;
    filterValue: string;
}

export class FilterTypes{
    filterTypeValue: string;
    filterTypeName: string;
}

export const FilterTypeList: FilterTypes [] = [
    {
        filterTypeValue: 'status',
        filterTypeName: 'Status'
    }, 
    {
        filterTypeValue: 'siteId',
        filterTypeName: 'Site Id'
    }, 
    {
        filterTypeValue: 'siteName',
        filterTypeName: 'Site Name'
    },
    // {
    //     filterTypeValue: 'serverName',
    //     filterTypeName: 'Server Name'
    // },
    {
        filterTypeValue: 'minionVersion',
        filterTypeName: 'Minion Version'
    }, 
    
    // {
    //     filterTypeValue: 'operatingSystem',
    //     filterTypeName: 'Operating System'
    // }, 
    {
        filterTypeValue: 'appName',
        filterTypeName: 'PIMS Name'
    }, 
    {
        filterTypeValue: 'appVersion',
        filterTypeName: 'PIMS Version'
    }];