const Newline = require('./Newline');

class HtmlTag {
    static create(name) {
        return new HtmlTag(name);
    }

    constructor(name, children = [], attributes = {}) {
        this._name = name;
        this._children = children;
        this._attributes = attributes;
    }

    attribute(name, value) {
        return new HtmlTag(this._name, this._children, { ...this._attributes, [name]: value });
    }

    children(value) {
        return new HtmlTag(this._name, Array.isArray(value) ? value : [value], this._attributes);
    }

    render(indentation, indentationLevel = 0) {
        const currentIndentation = indentation.repeat(indentationLevel);

        const formattedAttributes = Object.entries(this._attributes)
            .map(([name, value]) => `${name}="${value}"`)
            .join(' ');

        const header = [this._name, formattedAttributes].filter(Boolean).join(' ');
        const footer = this._name;

        if (this._children.length === 0) {
            return `<${header} />`;
        }

        const firstChild = this._children[0];
        if (this._children.length === 1 && !(firstChild instanceof HtmlTag)) {
            return `<${header}>${firstChild}</${footer}>`;
        }

        const hasNewlines = this._children.some(child => child instanceof Newline);
        const hasTags = this._children.some(child => child instanceof HtmlTag);
        const additionalIndentationEnabled = hasNewlines || hasTags;
        const additionalIndentation = additionalIndentationEnabled ? (currentIndentation + indentation) : '';

        const children = this._children.map((child) => {
            if (child instanceof Newline) {
                return '\n' + additionalIndentation;
            }

            if (child instanceof HtmlTag) {
                return child.render(indentation, indentationLevel + 1);
            }

            return String(child);
        });

        return [
            `<${header}>`,
            additionalIndentationEnabled ? '\n' : '',
            additionalIndentation,
            ...children,
            additionalIndentationEnabled ? '\n' : '',
            additionalIndentationEnabled ? currentIndentation : '',
            `</${footer}>`
        ].filter(Boolean).join('');
    }
}

module.exports = HtmlTag;
