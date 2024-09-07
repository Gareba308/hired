import {google} from 'googleapis'

export async function authorize(){
    return new Promise((resolve, reject)=> {
        const key= require('../key.json');

        return new google.auth.JWT(
            key.client_email,
            undefined,
            key.private_key,
            ['https://www.googleapis.com/auth/indexing'],
            undefined
        ).authorize((err: any, tokens: any)=>{
            if(err){
                return reject(err)
            }
            resolve(tokens.access_token);
        })
    })
}