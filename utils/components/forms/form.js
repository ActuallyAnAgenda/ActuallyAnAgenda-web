import React from "react";

class Form extends React.Component {

    /**
     * Props: Input type map (input), Form submit message (message), prevState, onSubmit
         Input Map Requirements: {
             id: __,
             type: __,
             placeholder: __,
             required: __,
         }
     */
    constructor(props) {
        super(props);
        this.state = {submitted: false};
    }

    render() {
        let firstInput = true;
        const onSubmit = (event) => {
            event.preventDefault();
            if (this.state.submitted) return;
            console.log(this.state)
            this.setState({submitted: true});
            this.props.submit(this.state, () => this.setState({submitted: false}));
        }
        const inputList = this.props.inputs.map((input) => {
            const id = input.id;
            const type = input.type === "datetime-local" ? this.state[input.id + "-type"] : input.type;
            const required = input.required;
            const placeholder = input.placeholder;
            const className = firstInput ? "top-input-offset" : undefined;
            const onFocus = input.type === "datetime-local" ? (evt) => {
                this.setState({[input.id + "-type"]: "datetime-local"})
            } : undefined;
            const onBlur = input.type === "datetime-local" ? (evt) => {
                if (evt.target.value === "" && !evt.target.validity.badInput) {
                    this.setState({[input.id + "-type"]: "text"});
                }
            } : undefined;
            const min = input.min;
            const max = input.max;
            const minLength = input.minLength;
            const maxLength = input.maxLength;
            if (firstInput) {
                firstInput = false;
            }
            return (<input key={id} id={id} required={required} type={type} className={className}
                           onFocus={onFocus} onBlur={onBlur} min={min} max={max} minLength={minLength} maxLength={maxLength}
                           onChange={(evt) => this.setState({[id]: evt.target.value})} placeholder={placeholder}
            />);
        })
        return (
            <form className={'form'} onSubmit={onSubmit}>
                {inputList}
                <input type="submit" className={'submit'} value={this.props.message}/>
            </form>
        );
    }

    // prop requirements: input type map, form submit message, prevState, onSubmit
    /**
     * Accepts a "previous state"
     * @param this.props.prevState == {
     *     docID: (the ID of the previous document in Firestore),
     *     value: {
     *          __Firestore Contents__
     *     }
     * }
     * @param this.props.prevState.docID
     * @param this.props.prevState.value
     */
    componentDidMount() {
        let isDate = {};
        for (let i = 0; i < this.props.inputs.length; i++) {
            let input = this.props.inputs[i];
            this.setState({[input.id]: ''});
            if (input.type === "datetime-local") {
                isDate[input.id] = true;
                const type = this.props.prevState == null ? "text" : "datetime-local";
                this.setState({[input.id + "-type"]: type})
            }
        }
        if (this.props.prevState != null) {
            // Sets a default value
            for (const id in this.props.prevState.value) {
                let v = this.props.prevState.value[id];
                if (isDate[id]) {
                    const d = new Date(v);
                    v = (new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString()).slice(0, -1);
                }
                document.getElementById(id).value = v;
                this.setState({[id]: v});
            }
        }
    }
}

export default Form;