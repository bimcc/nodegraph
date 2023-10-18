class TextWidget extends BimccGraph.BaseWidget {

    static widgetType = 'text'

    DOM;

    constructor(option) {
        super()

        this.DOM = document.createElement("span")

        this.setStyle({
            width: '100%',
            textAlign: 'center',
            display: 'block',
            fontSize: '20px'
        })
        if (option.text) {
            this.DOM.innerText = option.text
        }

        this.onMousedown((e) => {
            e.stopPropagation();
        })
    }

    onChange(closure) {
        // this.DOM.addEventListener('input', () => {
        //     closure(this.DOM.innerText)
        // })
    }

    getValue() {
        return this.DOM.innerText;
    }

    setValue(value) {
        this.DOM.innerText = value;
    }

    getLabel() {
        //return this.DOM.innerText
    }
}
