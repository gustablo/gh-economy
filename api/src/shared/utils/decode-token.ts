import { verify } from 'jsonwebtoken';

export const decodeToken = async (token: string): Promise<{ name: string, id: string }> => {
    return new Promise((resolve, reject) => {
    
        verify(token, process.env.SECRET!, (err, decoded) => {
            if (err) return reject(err);

            return resolve(decoded as { name: string, id: string });
        });
    });
}
