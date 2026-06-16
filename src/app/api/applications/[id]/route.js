import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Application from "@/models/Application";

export async function DELETE(req, { params }) {
    try {
        await connectDB();

        const { id } = await params;

        const deletedApplication = await Application.findByIdAndDelete(id);

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

export async function PATCH(req, { params }) {
    try {
        await connectDB();
        
        const { id } = await params;
        const body = await req.json();

        const allowedUpdates = ['company', 'role', 'jobUrl', 'status', 'notes'];
        const updates = {};

        for (const key of allowedUpdates) {
            if (key in body) {
                updates[key] = body[key];
            }
        }

        if ('company' in updates && !updates.company.trim()) {
            return NextResponse.json(
                { error: 'Company cannot be empty.'},
                { status: 400 }
            );
        }

        if ('role' in updates && !updates.role.trim()) {
            return NextResponse.json(
                { error: 'Role cannot be empty.'},
                { status: 400 }
            );
        }

        if ('company' in updates) updates.company = updates.company.trim();
        if ('role' in updates) updates.role = updates.role.trim();
        if ('jobUrl' in updates) updates.jobUrl = updates.jobUrl?.trim() || '';
        if ('notes' in updates) updates.notes = updates.notes?.trim() || '';

        const updatedApplication = await Application.findByIdAndUpdate(
            id,
            updates,
            { new: true, runValidators: true }
        );

        if (!updatedApplication) {
            return NextResponse.json(
                { error: 'Application not found.'},
                { status: 404 }
            );
        }

        return NextResponse.json({ application: updatedApplication });
        } catch (err) {
            console.error(err);
            return NextResponse.json(
                { error: 'Server error.'},
                { status: 500 }
            );
        }
}