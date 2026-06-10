import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Application from "@/models/Application";

export async function DELETE(req, { params }) {
    try {
        await connectDB();

        const deletedApplication = await Application.findByIdAndDelete(params.id);

        if (!deletedApplication) {
            return NextResponse.json(
                { error: 'Application not found.' },
                { status: 404 }
            );
        }

        return NextResponse.json({ ok: true });
    } catch (err) {
        console.error(err);
        return NextResponse.json(
            { error: 'Server error' },
            { status: 500 }
        );
    }
}