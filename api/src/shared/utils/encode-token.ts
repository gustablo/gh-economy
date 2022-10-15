import jwt from 'jsonwebtoken';

export const encodeToken = async (name: string, id: string) => {
    return new Promise((resolve, reject) => {
        jwt.sign({ name, id }, process.env.SECRET!, { expiresIn: '1y' }, (err, token) => {
            if (err) return reject(err);
            
            return resolve(token);
        })
    });

}
