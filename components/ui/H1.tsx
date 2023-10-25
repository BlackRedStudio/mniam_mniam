import { ReactNode } from 'react';

type TH1Props = {
    children: ReactNode;
};

const H1 = ({ children }: TH1Props) => (
    <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl mb-7">
        {children}
    </h1>
);

export default H1;
