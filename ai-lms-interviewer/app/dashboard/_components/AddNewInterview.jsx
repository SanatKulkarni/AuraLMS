"use client"
import React, { useState } from 'react'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "@/components/ui/dialog"
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { chatSession } from '@/utils/GeminiAIModal'
import { LoaderCircle } from 'lucide-react'
import { MockInterview } from '@/utils/schema'
import { v4 as uuidv4 } from 'uuid';
import moment from 'moment'
import { db } from '@/utils/db'
import { useRouter } from 'next/navigation'

function AddNewInterview() {
    const [openDialog, setOpenDialog] = useState(false);
    const [jobPosition, setJobPosition] = useState('');
    const [jobDesc, setJobDesc] = useState('');
    const [jobExp, setJobExp] = useState('');
    const [loading, setLoading] = useState(false);
    const [jsonResponse, setJsonResponse] = useState([]);
    const router = useRouter();
    const user = {primaryEmailAddress: {emailAddress: "test@example.com"}};

    const onSubmit = async (e) => {
        setLoading(true);
        e.preventDefault();
        console.log(jobPosition, jobDesc, jobExp);
    
        const InputPrompt = `Job Position: ${jobPosition}, Job Description: ${jobDesc}, Years of Experience: ${jobExp}, Depends on Job Position, Job Description and Years of Experience give us ${process.env.NEXT_PUBLIC_INTERVIEW_QUESTION_COUNT} interview question along with answer in JSON format, Give us question and answer field on JSON`;
    
        try {
            const result = await chatSession.sendMessage(InputPrompt);
            const MockJsonResp = (await result.response.text()).replace('```json', '').replace('```', '').trim();
    
            console.log(JSON.parse(MockJsonResp));
            setJsonResponse(MockJsonResp);
    
            if (MockJsonResp) {
                const resp = await db.insert(MockInterview)
                    .values({
                        mockId: uuidv4(),
                        jsonMockResp: MockJsonResp,
                        jobPosition: jobPosition,
                        jobDesc: jobDesc,
                        jobExp: jobExp,
                        createdBy: user?.primaryEmailAddress?.emailAddress,
                        createdAt: moment().format('DD-MM-YYYY')
                    })
                    .returning({ mockId: MockInterview.mockId });
    
                console.log("Inserted ID:", resp);
                if (resp) {
                    setOpenDialog(false);
                    router.push('/dashboard/interview/' + resp[0]?.mockId);
                }
            } else {
                console.log("ERROR");
            }
        } catch (error) {
            console.error('Error during JSON parsing or DB insertion:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <div className='p-10 border rounded-lg bg-secondary hover:scale-105 hover:shadow-md cursor-pointer transition-all'
                onClick={() => setOpenDialog(true)}
            >
                <h2 className='text-lg text-center'>+ Add New</h2>
            </div>
            <Dialog open={openDialog} onOpenChange={setOpenDialog}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle className="text-2xl">Tell us more about your job interviewing</DialogTitle>
                        <DialogDescription>
                            <form onSubmit={onSubmit}>
                                <div>
                                    <h2>Add Details about your job position/role, Job description and years of experience</h2>
                                    <div className='mt-7 my-3'>
                                        <label>Job Role/Job Position</label>
                                        <div className='mt-1'>
                                            <Input placeholder="Ex. Full Stack Developer" required
                                                value={jobPosition}
                                                onChange={(event) => setJobPosition(event.target.value)}
                                            />
                                        </div>
                                    </div>
                                    <div className='my-3'>
                                        <label>Job Description/ Tech Stack (In Short)</label>
                                        <div className='mt-1'>
                                            <Textarea placeholder="Ex. React, Angular, NodeJs, MySql etc" required
                                                value={jobDesc}
                                                onChange={(event) => setJobDesc(event.target.value)}
                                            />
                                        </div>
                                    </div>
                                    <div className='my-3'>
                                        <label>Years of experience</label>
                                        <div className='mt-1'>
                                            <Input placeholder="Ex. 5" type="number" max="50" required
                                                value={jobExp}
                                                onChange={(event) => setJobExp(event.target.value)}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className='flex gap-5 justify-end'>
                                    <Button type="button" variant="ghost" onClick={() => setOpenDialog(false)}>Cancel</Button>
                                    <Button type="submit" disabled={loading}>
                                        {
                                            loading ?
                                                <>
                                                    <LoaderCircle className='animate-spin' /> Generating from AI
                                                </> : 'Start Interview'
                                        }
                                    </Button>
                                </div>
                            </form>
                        </DialogDescription>
                    </DialogHeader>
                </DialogContent>
            </Dialog>
        </div>
    )
}

export default AddNewInterview