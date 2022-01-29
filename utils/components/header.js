import {auth} from "../firebase/firebase";
import Image from "next/image"
import React from "react";

export function HeaderDivider() {
    return <div className={'divider-vertical'}/>;
}

export function GlobalHeader(props) {
    const authInfo = props.authInfo;

    if (authInfo.authUser == null) return (<div className={'header'}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <a className={'item'} href={'/'}>{'Home'}</a>
        <HeaderDivider/>
        <a className={'item right'} href={'/login'}>Login</a>
        <p className={'item'}>or</p>
        <a className={'item'} href={'/signup'}>Sign Up</a>
    </div>);

    return (<div className={'header'}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <a className={'item'} href={'/'}>{'Home'}</a>
        <HeaderDivider/>
        <a className={'item'} href={'/create'}>Create A Task</a>
        <HeaderDivider/>
        <div className={'profile right'}>
            <a className={'item'} href={'/user'}>
                {`My Tasks`}
            </a>
            <a className={'dropdown-item'} href={'/logout'} onClick={(evt) => {
                let ignore = auth.signOut();
                return true;
            }}>Log Out</a>
        </div>
    </div>);
}


export default GlobalHeader;