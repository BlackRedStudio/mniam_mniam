import { Dispatch, SetStateAction, createContext } from "react";

type TCameraContext = {
    camera: number,
    setCamera: Dispatch<SetStateAction<number>>
} | undefined

const CameraContext = createContext<TCameraContext>(undefined);

export default CameraContext;
