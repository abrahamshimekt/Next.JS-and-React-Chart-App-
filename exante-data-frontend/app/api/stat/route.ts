import { NextResponse } from "next/server"
// import dataStat from '../../../datajson/data.json'
import data from '../../../public/data/data.json'


export async function GET(request: Request) {
//   let updateData: any = []
  try{
    // dataStat.map((item: any) => {
    //   updateData.push({
    //       'name': item['SERIES'],
    //       'US Money Market Fund Flows': parseFloat(item['US Money Market Fund Flows']),
    //       'US Money Market Fund Flows (5d m/a)': parseFloat(item['US Money Market Fund Flows (5d m/a)'])
        
    //   })
    // })
    return NextResponse.json(data, { status: 200 })

  }
  catch(e){
    return NextResponse.json({ error: 'server error' }, { status: 500 })
  }
}


