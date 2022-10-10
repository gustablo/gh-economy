export type SignupRequestDTO = {
    role: 'CITIZEN' | 'GOVERNMENT';
    name: string;
    password: string;
}
