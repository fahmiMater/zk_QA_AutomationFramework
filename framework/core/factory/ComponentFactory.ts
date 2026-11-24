import { Page } from '@playwright/test';

import { BaseFactory } from './BaseFactory';
import { DialogComponent } from '../../components/dialog/DialogComponent';
import { TabsComponent } from '../../components/tabs/TabsComponent';
import { TextBoxComponent } from '../../components/textbox/TextBoxComponent';
import { DropdownComponent } from '../../components/dropdown/DropdownComponent';
import { LookupComponent } from '../../components/lookup/LookupComponent';
import { CheckboxComponent } from '../../components/checkbox/CheckboxComponent';
import { RadioButtonComponent } from '../../components/radio/RadioButtonComponent';
import { DatePickerComponent } from '../../components/datepicker/DatePickerComponent';
import { GridComponent } from '../../components/grid/GridComponent';
import { FileUploadComponent } from '../../components/fileupload/FileUploadComponent';
import { ButtonComponent } from '../../components/button/ButtonComponent';
import { MultiSelectComponent } from '../../components/multiselect/MultiSelectComponent';
import { ToastComponent } from '../../components/toast/ToastComponent';
import { Automation } from '../automation/Automation';

export class ComponentFactory extends BaseFactory {

    constructor(
        page: Page
    ) {
        super(page);
    }

    grid(
        automationId: string
    ): GridComponent {

        return new GridComponent(
            this.page,
            automationId
        );
    }

    dialog(
        automationId: string
    ): DialogComponent {

        return new DialogComponent(
            this.page,
            Automation.byId(automationId)
        );
    }

    tabs(
        automationId: string
    ): TabsComponent {

        return new TabsComponent(
            this.page,
            Automation.byId(automationId)
        );
    }

    textBox(
        automationId: string
    ): TextBoxComponent {

        return new TextBoxComponent(
            this.page,
            Automation.byId(automationId)
        );
    }

    dropdown(
        automationId: string
    ): DropdownComponent {

        return new DropdownComponent(
            this.page,
            automationId
        );
    }

    lookup(
        automationId: string
    ): LookupComponent {

        return new LookupComponent(
            this.page,
            automationId
        );
    }

    checkbox(
        automationId: string
    ): CheckboxComponent {

        return new CheckboxComponent(
            this.page,
            automationId
        );
    }

    radio(
        automationId: string
    ): RadioButtonComponent {

        return new RadioButtonComponent(
            this.page,
            automationId
        );
    }
    datePicker(
        automationId: string
    ): DatePickerComponent {

        return new DatePickerComponent(
            this.page,
            automationId
        );
    }

    fileUpload(
        automationId: string
    ): FileUploadComponent {
        
        return new FileUploadComponent(
            this.page,
            automationId
        );
    }

    button(
        automationId: string
    ): ButtonComponent {
        
        return new ButtonComponent(
            this.page,
            automationId
        );
    }

    multiSelect(
        automationId: string
    ): MultiSelectComponent {
        
        return new MultiSelectComponent(
            this.page,
            automationId
        );
    }

    toast(
        automationId: string
    ): ToastComponent {
        
        return new ToastComponent(
            this.page,
            automationId
        );
    }

}