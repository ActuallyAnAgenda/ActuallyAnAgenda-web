import React from "react";

export function ButtonContainer(props) {
    const buttons = props.buttons;
    const buttonList = buttons.map((btn) => {
        const name = btn.name;
        const description = btn.description;
        const href = btn.href;
        return (<a key={name} className={'button'} href={href}>
            <span className={"event-name"}>{name}</span>
            <span className={"description"}>{description}</span>
        </a>);
    });
    return <div className={'main-task-menu'}>
        {buttonList}
    </div>;
}

export function Title(props) {
    return <h1 className={'title'}>{props.name}</h1>
}

export function Divider() {
    return <hr className={'divider'}/>;
}

export function Error(props) {
    return (<div className={'error'}>
        {props.error}
    </div>)
}