'use client'

import { redirect } from "next/navigation";

function NotFound() {
    redirect('/');
}

export default NotFound;
