export interface Parameters {
    commandTypeId: number;
    commandTypeName: string;
    name: string;
    value: string;
    item: ParameterDisplaySettings;
}

export class ParameterDisplaySettings {
    displayName: string;
    suggestedInput: string;
    dropdown: string[];
    fieldType: string;
    dataType: string;
    required: boolean;
    displayOrder: number;
    userInstructions: string;
}
