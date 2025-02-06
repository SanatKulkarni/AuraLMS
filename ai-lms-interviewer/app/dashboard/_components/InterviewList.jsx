"use client"
import { db } from '@/utils/db';
import { MockInterview } from '@/utils/schema';
import { desc, eq } from 'drizzle-orm';
import React, { useEffect, useState } from 'react'
import Interview from '../interview/[interviewId]/page';
import InterviewItemCard from './InterviewItemCard';

function InterviewList() {
    const user = {primaryEmailAddress: {emailAddress: "test@example.com"}};
    const [interviewList,setInterviewList]=useState([]);
    useEffect(()=>{
        GetInterviewList();
    },[])

    const GetInterviewList=async()=>{
        const result=await db.select()
        .from(MockInterview)
        .where(eq(MockInterview.createdBy,user?.primaryEmailAddress?.emailAddress))
        .orderBy(desc(MockInterview.id));

        console.log(result);
        setInterviewList(result);
    }
  return (
    <div>
      <h2 className='font-medium text-2xl'><strong>Previous Mock Interview</strong></h2>
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 my-3'>
        {interviewList&&interviewList.map((Interview,index)=>(
            <InterviewItemCard 
            interview={Interview}
            key={index}/>
        ))}
      </div>
    </div>
  )
}

export default InterviewList
