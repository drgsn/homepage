import { sourcesConfig } from '../config/sourceConfig.js';

export class FiltersModal {
    static build() {
        const modalContent = document.getElementById('filtersModalContent');
        modalContent.innerHTML = '';

        sourcesConfig.forEach((source) => {
            const section = this.createSourceSection(source);
            modalContent.appendChild(section);
        });
    }

    static createSourceSection(source) {
        const isDark = document.documentElement.classList.contains('dark');
        const section = document.createElement('div');
        section.className = isDark
            ? 'bg-gray-700 p-4 rounded-lg space-y-4'
            : 'bg-gray-50 p-4 rounded-lg space-y-4';

        const header = this.createSectionHeader(source, isDark);
        section.appendChild(header);

        source.fields.forEach((field) => {
            if (field.key === 'enabled') return;
            const fieldElement = this.createFilterField(source.id, field, isDark);
            section.appendChild(fieldElement);
        });

        return section;
    }

    static createSectionHeader(source, isDark) {
        const header = document.createElement('div');
        header.className = 'flex items-center justify-between mb-4';

        const title = document.createElement('h3');
        title.className = isDark
            ? 'text-md font-semibold text-gray-200 flex items-center'
            : 'text-md font-semibold text-gray-900 flex items-center';
        title.innerHTML = `${source.icon}${source.label} Settings`;

        const enabledField = source.fields.find((f) => f.key === 'enabled');
        if (enabledField) {
            const toggle = this.createToggleSwitch(source.id, enabledField);
            header.appendChild(toggle);
        }

        header.appendChild(title);
        return header;
    }

    static createToggleSwitch(sourceId, field) {
        const label = document.createElement('label');
        label.className = 'relative inline-flex items-center cursor-pointer';

        const input = document.createElement('input');
        input.type = 'checkbox';
        input.className = 'sr-only peer';
        input.id = `${sourceId}_${field.key}`;

        const slider = document.createElement('div');
        slider.className = `
            w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full 
            dark:bg-gray-700 peer-checked:after:translate-x-full 
            after:content-[''] after:absolute after:top-[2px] 
            after:left-[2px] after:bg-white after:border-gray-300 
            after:border after:rounded-full after:h-5 after:w-5 
            after:transition-all dark:border-gray-600 
            peer-checked:bg-blue-600
        `;

        label.appendChild(input);
        label.appendChild(slider);

        return label;
    }

    static createFilterField(sourceId, field, isDark) {
        const container = document.createElement('div');
        container.className = 'space-y-2';

        const label = document.createElement('label');
        label.className = isDark
            ? 'block text-sm font-medium text-gray-300'
            : 'block text-sm font-medium text-gray-700';
        label.htmlFor = `${sourceId}_${field.key}`;
        label.textContent = field.label;

        const input = this.createInput(sourceId, field);

        container.appendChild(label);
        container.appendChild(input);

        return container;
    }

    static createInput(sourceId, field) {
        let input;

        if (field.type === 'select') {
            input = document.createElement('select');
            input.className = 'theme-select';

            field.options.forEach((opt) => {
                const option = document.createElement('option');
                option.value = opt;
                option.textContent = opt.charAt(0).toUpperCase() + opt.slice(1);
                input.appendChild(option);
            });
        } else {
            input = document.createElement('input');
            input.type = field.type;
            input.className = 'theme-input';
            if (field.placeholder) {
                input.placeholder = field.placeholder;
            }
        }

        input.id = `${sourceId}_${field.key}`;
        return input;
    }

    static show() {
        const modal = document.getElementById('filtersModal');
        modal.classList.remove('hidden');
        modal.classList.add('flex');
        setTimeout(() => modal.classList.add('modal-active'), 10);
    }

    static hide() {
        const modal = document.getElementById('filtersModal');
        modal.classList.remove('modal-active');
        setTimeout(() => {
            modal.classList.remove('flex');
            modal.classList.add('hidden');
        }, 250);
    }
}
