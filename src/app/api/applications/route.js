import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Application from '@/models/Application';

export async function GET() {
    try {
        await connectDB();

        const applications = await Application.find().sort({ createdAt: -1 });

        return NextResponse.json({ applications });
    } catch (err) {
        console.error(err);
        return NextResponse.json(
            { error: 'Server error' },
            { status: 500 }
        );
    }
}

export async function POST(req) {
    try {
        await connectDB();

        const body = await req.json();
        const { company, role, jobUrl, status, notes } = body;

        if (!company || !company.trim()) {
            return NextResponse.json(
                { error: 'Company is required.' },
                { status: 400 }
            );
        }

        if (!role || !role.trim()) {
            return NextResponse.json(
                { error: 'Role is required.'},
                { status: 400 }
            );
        }

        const application = await Application.create({ 
            company: company.trim(),
            role: role.trim(),
            jobUrl: jobUrl?.trim() || '',
            status: status || 'saved',
            notes: notes?.trim() || '',
        });

        return NextResponse.json({ application }, { status: 201 });
    } catch (err) {
        console.error(err);
        return NextResponse.json(
            { error: 'Server error' },
            { status: 500 }
        );
    }
}