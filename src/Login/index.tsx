import React from 'react';
import './style.css';

import Api from '../Api/Api';
import { userType } from '../types/userType';
import { User } from 'firebase/auth';

type LoginProps = {

    onReceive: (user: User) => Promise<void>
}

export default ({ onReceive }:LoginProps) => {

    const handleGoogleLogin = async () => {

        const result = await Api.googlePoUp();

        if(result) {

            onReceive(result.user);

        }else {

            alert('ERRO!')
        }


    }

    return (

        <div className='login'>

            <button
                onClick={handleGoogleLogin}
            > 
                Faça login com Google 
            </button>

        </div>
    )


}