import { action, computed, makeObservable, observable } from "mobx";

export default class ValidatabaleValue
{
    @observable
    public value = "";

    @observable
    public errorText = "";

    @observable
    public label = "";

    @computed
    public get hasError()
    {
        return this.errorText !== "";
    }

    private validator: ( value: string ) => string

    constructor( label = "", validator = ( value: string ) => "" )
    {
        this.label = label;
        this.validator = validator;
        makeObservable( this );
    }

    @observable
    private _isValid = false;

    @computed
    public get isValid()
    {
        return this._isValid;
    }

    @action
    public validate()
    {
        this._isValid = false;
        this.errorText = this.validator( this.value );

        if ( this.errorText === "" && this.value !== "" )
        {
            this._isValid = true;
        }

        return this.isValid;
    }
}