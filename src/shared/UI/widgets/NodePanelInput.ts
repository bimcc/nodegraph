import { IFunction } from "../../../interfaces";
import { NativeDiv } from "../NativeDiv";
import { NaiveInput } from "../NativeInput";

export class NodePanelInput{
    parent : NativeDiv;
    root : NativeDiv;
    label : NativeDiv;
    input : NaiveInput;

    isReadOnly : boolean = false;

    styles : any = {
        fontColor : '#ffffff',
        backColor : '#4b4b4b',
    }

    constructor( parent : NativeDiv, ){
        this.parent = parent;
        this.root = new NativeDiv();
        this.label = new NativeDiv();
        this.input = new NaiveInput('', '请输入');
        this.init();
    }
    
    setReadOnly( isReadOnly : boolean){
        const { input } = this;

        if(!isReadOnly){
            input.removeAttribute('readonly');
            input.setStyle({
                backgroundColor : '#a8a8a8',
            })
        }else{
            input.setAttribute('readonly','readonly');
            input.setStyle({
                backgroundColor : this.styles.backColor,
                fontSize : '17px',
            })
        }

        this.isReadOnly = isReadOnly;
    }

    setValue( value : string, label ?: string ){
        this.input.setValue(value);

        if(label){
            this.label.innerText(label);
        }
    }

    onChange( onChange : IFunction ){
        this.input.onChange(()=>{
            onChange(this.input.getValue());
        });
    }

    private init(){
        const { root, label, input } = this;

        root.setStyle({
            display : 'flex',
            width : 'calc( 100% - 20px)',
            height : '30px',
            margin : '5px 10px 0px 10px',
            color: this.styles.fontColor,
            backgroundColor : this.styles.backColor,
        })

        label.setStyle({
            width : '100px',
            lineHeight : '30px',
        });

        label.innerText('测试');

        input.setStyle({
            lineHeight : '30px',
            backgroundColor : '#a8a8a8',
            color: this.styles.fontColor,
            borderRadius : '2px',
            fontSize:"16px"
        });

        root.add(label);
        root.add(input);
        this.parent.add(root);
    }

    refresh(){
        const { root, label, input } = this;

        root.setStyle({
            color: this.styles.fontColor,
            backgroundColor : this.styles.backColor,
        });

        input.setStyle({
            color: this.styles.fontColor,
        });

        this.setReadOnly(this.isReadOnly);
    }

    remove(){
        this.root.remove();
    }
}