import React, { useMemo, useState } from "react";
import {
  ArrowLeft, Bell, Building2, CalendarDays, Check, ChevronDown,
  ChevronRight, ClipboardCheck, FileText, HardHat, Home, Inbox,
  Menu, MessageCircle, Paperclip, Plus, Search, Send, Settings,
  ShieldCheck, Upload, Users, Eye, AlertCircle, Circle
} from "lucide-react";

/*
 HOMEWARD — Builder-powered homebuyer beta
 Product principle: Builder is the paying/controller customer.
 Buyer is the ultimate user.
 Homeward personalizes each buyer portal from Project + Home Type + Lot + Closing Date + Buyer data.

 This is a self-contained React prototype intended to be run in a React/Vite-style environment.
 It uses local component state for the beta; no backend is required to explore the UX.
*/

const BRAND = "#173A57";

const HOME_TYPES = {
  Detached: [
    ["Confirm your lawyer", "Provide your lawyer's contact information.", "Legal"],
    ["Provide mortgage commitment", "Upload your final financing confirmation.", "Financing"],
    ["Arrange home insurance", "Provide proof of insurance effective on possession.", "Insurance"],
    ["Review closing information", "Review builder-provided closing information.", "Builder"],
    ["Review upgrade summary", "Confirm your selected upgrades and options.", "Home"],
    ["Book your Pre-Delivery Inspection", "Confirm your PDI appointment.", "PDI"],
    ["Prepare for possession", "Review your possession-day instructions.", "Possession"],
  ],
  "Semi-Detached": [
    ["Confirm your lawyer", "Provide your lawyer's contact information.", "Legal"],
    ["Provide mortgage commitment", "Upload your final financing confirmation.", "Financing"],
    ["Arrange home insurance", "Provide proof of insurance effective on possession.", "Insurance"],
    ["Review closing information", "Review builder-provided closing information.", "Builder"],
    ["Book your Pre-Delivery Inspection", "Confirm your PDI appointment.", "PDI"],
    ["Prepare for possession", "Review your possession-day instructions.", "Possession"],
  ],
  Townhome: [
    ["Confirm your lawyer", "Provide your lawyer's contact information.", "Legal"],
    ["Provide mortgage commitment", "Upload your final financing confirmation.", "Financing"],
    ["Arrange home insurance", "Provide proof of insurance effective on possession.", "Insurance"],
    ["Review closing information", "Review builder-provided closing information.", "Builder"],
    ["Review homeowner / community information", "Review the information applicable to your townhome community.", "Community"],
    ["Book your Pre-Delivery Inspection", "Confirm your PDI appointment.", "PDI"],
    ["Prepare for possession", "Review your possession-day instructions.", "Possession"],
  ],
  Condo: [
    ["Confirm your lawyer", "Provide your lawyer's contact information.", "Legal"],
    ["Provide mortgage commitment", "Upload your final financing confirmation.", "Financing"],
    ["Arrange home insurance", "Provide proof of insurance.", "Insurance"],
    ["Review closing information", "Review builder-provided closing information.", "Builder"],
    ["Review condominium information", "Review applicable condominium documents and instructions.", "Condo"],
    ["Confirm occupancy / possession information", "Review the information supplied for your occupancy or possession.", "Possession"],
  ],
};

const seedBuyer = {
  id: "buyer-1",
  firstName: "Sarah",
  lastName: "Smith",
  email: "sarah@example.com",
  project: "Maple Ridge",
  homeType: "Detached",
  lot: "42",
  address: "18 Maple Ridge Drive",
  closingDate: "2026-11-06",
  upgrades: ["Finished basement", "Kitchen package"],
  tasks: HOME_TYPES.Detached.map((x, i) => ({
    id: `t${i + 1}`, title: x[0], description: x[1], category: x[2],
    due: ["2026-09-12","2026-09-18","2026-09-28","2026-10-03","2026-10-10","2026-10-23","2026-10-27"][i],
    status: i < 2 ? "complete" : i === 2 ? "in_progress" : "not_started",
    required: true,
  })),
  documents: [
    { id: "d1", name: "Purchase Agreement", type: "Builder document", status: "available" },
    { id: "d2", name: "Upgrade Summary", type: "Home-specific document", status: "available" },
    { id: "d3", name: "Mortgage Commitment", type: "Buyer submission", status: "approved" },
  ],
};

const seedBuyers = [
  seedBuyer,
  { ...seedBuyer, id:"buyer-2", firstName:"Michael", lastName:"Chen", email:"michael@example.com", homeType:"Townhome", lot:"18", address:"7 Cedar Lane", closingDate:"2026-10-16", tasks: HOME_TYPES.Townhome.map((x,i)=>({id:`m2-${i}`,title:x[0],description:x[1],category:x[2],due:["2026-08-28","2026-09-02","2026-09-20","2026-09-30","2026-10-02","2026-10-05","2026-10-09"][i],status:i===1?"overdue":i===0?"complete":"not_started",required:true})), documents:[{id:"d4",name:"Purchase Agreement",type:"Builder document",status:"available"}] },
  { ...seedBuyer, id:"buyer-3", firstName:"Emma", lastName:"Wilson", email:"emma@example.com", homeType:"Semi-Detached", lot:"61", address:"24 Maple Ridge Drive", closingDate:"2026-12-04", tasks: HOME_TYPES["Semi-Detached"].map((x,i)=>({id:`m3-${i}`,title:x[0],description:x[1],category:x[2],due:["2026-10-01","2026-10-18","2026-11-01","2026-11-05","2026-11-10","2026-11-17"][i],status:i===0?"complete":i===1?"in_progress":"not_started",required:true})), documents:[{id:"d5",name:"Purchase Agreement",type:"Builder document",status:"available"}] },
];

const pct = b => b.tasks.length ? Math.round(b.tasks.filter(t=>t.status==="complete").length/b.tasks.length*100) : 0;
const date = d => new Date(d+"T00:00:00").toLocaleDateString(undefined,{month:"short",day:"numeric",year:"numeric"});
const days = d => Math.max(0,Math.ceil((new Date(d+"T00:00:00")-new Date())/86400000));

function Button({children,onClick,primary=false,small=false,icon:Icon}) {
  return <button onClick={onClick} style={{background:primary?BRAND:"#fff",color:primary?"#fff":"#334155",border:"1px solid "+(primary?BRAND:"#D9E1E8"),borderRadius:9,padding:small?"7px 10px":"10px 13px",fontSize:small?11:12,fontWeight:750,cursor:"pointer",display:"inline-flex",alignItems:"center",gap:7}}>
    {Icon&&<Icon size={14}/>} {children}
  </button>
}
function Card({children,style={}}){return <div style={{background:"#fff",border:"1px solid #E3E8EE",borderRadius:14,boxShadow:"0 2px 8px rgba(15,23,42,.035)",...style}}>{children}</div>}
function Badge({children,tone="neutral"}) {
  const m={neutral:["#F1F5F9","#475569"],success:["#EAF6EF","#28734A"],warning:["#FFF4E5","#9A5A00"],danger:["#FDECEC","#B42318"],blue:["#EAF2FF","#285B9A"]}[tone];
  return <span style={{background:m[0],color:m[1],padding:"5px 8px",borderRadius:999,fontSize:10,fontWeight:800,whiteSpace:"nowrap"}}>{children}</span>
}
function Progress({value}){return <div style={{height:7,borderRadius:99,background:"#E9EEF3",overflow:"hidden"}}><div style={{height:"100%",width:value+"%",background:BRAND,borderRadius:99}}/></div>}
function Title({title,sub,action}){return <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-end",marginBottom:16,gap:12}}><div><h2 style={{margin:0,fontSize:20}}>{title}</h2>{sub&&<div style={{fontSize:12,color:"#788696",marginTop:4}}>{sub}</div>}</div>{action}</div>}

function Sidebar({page,setPage}) {
  const items=[["dashboard","Dashboard",Building2],["buyers","Buyers",Users],["projects","Projects",Home],["tasks","Task templates",ClipboardCheck],["documents","Documents",FileText],["messages","Messages",Inbox],["settings","Settings",Settings]];
  return <aside style={{position:"fixed",left:0,top:0,bottom:0,width:235,background:"#102A40",color:"#fff",padding:"20px 14px",zIndex:5}}>
    <div style={{display:"flex",alignItems:"center",gap:10,padding:"2px 8px 25px"}}><div style={{width:36,height:36,borderRadius:10,background:BRAND,display:"grid",placeItems:"center"}}><Home size={18}/></div><div><b style={{fontSize:16}}>Homeward</b><div style={{fontSize:8,color:"#9DB0C1",letterSpacing:1}}>BUILDER PLATFORM</div></div></div>
    <div style={{fontSize:9,color:"#70879A",fontWeight:800,padding:"0 9px 7px",letterSpacing:1}}>WORKSPACE</div>
    {items.map(([id,label,Icon])=><button key={id} onClick={()=>setPage(id)} style={{width:"100%",border:0,borderRadius:9,padding:"10px",background:page===id?"rgba(255,255,255,.11)":"transparent",color:page===id?"#fff":"#AAB9C8",display:"flex",alignItems:"center",gap:10,textAlign:"left",cursor:"pointer",fontSize:12,fontWeight:page===id?800:600,marginBottom:2}}><Icon size={15}/>{label}</button>)}
    <div style={{position:"absolute",left:24,bottom:20,fontSize:9.5,color:"#71879A"}}>Builder account<br/><b style={{color:"#D5E1EB"}}>Northstar Homes</b></div>
  </aside>
}

function BuilderDashboard({buyers,setPage}) {
  const total=buyers.reduce((n,b)=>n+b.tasks.length,0), complete=buyers.reduce((n,b)=>n+b.tasks.filter(t=>t.status==="complete").length,0), overdue=buyers.reduce((n,b)=>n+b.tasks.filter(t=>t.status==="overdue").length,0);
  return <><Title title="Builder dashboard" sub="One view of every buyer's path to closing." action={<Button primary icon={Plus}>Add buyer</Button>}/>
    <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:12,marginBottom:16}}>
      {[["Active buyers",buyers.length,"Across your projects",Users],["Closing ready",buyers.filter(b=>pct(b)===100).length,"100% complete",ShieldCheck],["Tasks completed",complete+"/"+total,"Across all buyers",ClipboardCheck],["Needs attention",overdue,"Overdue tasks",AlertCircle]].map(([a,b,c,I])=><Card key={a} style={{padding:16}}><div style={{fontSize:11,color:"#778594",fontWeight:750}}>{a}</div><div style={{fontSize:27,fontWeight:850,marginTop:4}}>{b}</div><div style={{fontSize:9.5,color:"#8B97A4",marginTop:3}}>{c}</div></Card>)}
    </div>
    <div style={{display:"grid",gridTemplateColumns:"1.4fr .6fr",gap:14}}>
      <Card style={{padding:17}}><Title title="Buyer readiness" sub="Personalized by home type, lot and closing date." action={<Button small onClick={()=>setPage("buyers")}>View all</Button>}/>
        {buyers.map(b=><button key={b.id} onClick={()=>setPage("buyers")} style={{width:"100%",display:"grid",gridTemplateColumns:"1.1fr 130px 90px",gap:15,alignItems:"center",background:"#fff",border:0,borderTop:"1px solid #EEF1F4",padding:"13px 4px",textAlign:"left",cursor:"pointer"}}><div><b style={{fontSize:11.5}}>{b.firstName} {b.lastName}</b><div style={{fontSize:9.5,color:"#84919F"}}>{b.homeType} · Lot {b.lot}</div></div><div><Progress value={pct(b)}/><div style={{fontSize:9,color:"#8793A0",marginTop:3}}>{pct(b)}% ready</div></div><Badge tone={b.tasks.some(t=>t.status==="overdue")?"danger":pct(b)===100?"success":"blue"}>{b.tasks.some(t=>t.status==="overdue")?"Attention":pct(b)===100?"Ready":"On track"}</Badge></button>)}
      </Card>
      <Card style={{padding:17}}><Title title="Product insight" sub="Why Homeward scales"/>
        <div style={{fontSize:11,color:"#536274",lineHeight:1.6}}>Builders configure templates once. Homeward then <b>tapers the experience</b> automatically to the buyer's home type, lot, upgrades and closing requirements.</div>
        <div style={{marginTop:14,padding:12,background:"#F2F6F9",borderRadius:10,fontSize:10,color:"#526274"}}><b>Builder controls</b><br/>Templates · deadlines · documents · messages</div>
        <div style={{marginTop:8,padding:12,background:"#F2F6F9",borderRadius:10,fontSize:10,color:"#526274"}}><b>Buyer sees</b><br/>Only what applies to their purchase</div>
      </Card>
    </div>
  </>
}

function Buyers({buyers,setSelected}) {
  return <><Title title="Buyers" sub="Every buyer receives a personalized Homeward portal." action={<Button primary icon={Plus}>Add buyer</Button>}/>
    <Card style={{padding:11,marginBottom:12}}><div style={{display:"flex",gap:8,alignItems:"center"}}><Search size={15} color="#8A96A3"/><input placeholder="Search buyers, lots or home types..." style={{border:0,outline:0,fontSize:11.5,width:"100%",padding:8}}/></div></Card>
    <Card style={{overflow:"hidden"}}>{buyers.map((b,i)=><button key={b.id} onClick={()=>setSelected(b.id)} style={{width:"100%",border:0,borderBottom:"1px solid #EEF1F4",background:"#fff",padding:"14px 16px",display:"grid",gridTemplateColumns:"1.25fr .8fr .8fr 110px 90px",alignItems:"center",textAlign:"left",cursor:"pointer"}}>
      <div><b style={{fontSize:12}}>{b.firstName} {b.lastName}</b><div style={{fontSize:9.5,color:"#8793A0"}}>{b.email}</div></div><div><div style={{fontSize:10.5,fontWeight:700}}>{b.homeType}</div><div style={{fontSize:9.5,color:"#8793A0"}}>Lot {b.lot}</div></div><div style={{fontSize:10.5}}>{date(b.closingDate)}</div><div style={{paddingRight:15}}><Progress value={pct(b)}/><div style={{fontSize:9,color:"#8793A0",marginTop:3}}>{pct(b)}%</div></div><Badge tone={b.tasks.some(t=>t.status==="overdue")?"danger":pct(b)===100?"success":"blue"}>{b.tasks.some(t=>t.status==="overdue")?"Attention":pct(b)===100?"Ready":"On track"}</Badge>
    </button>)}</Card></>
}

function BuyerProfile({buyer,setBuyer,setPortal}) {
  const [tab,setTab]=useState("overview");
  const toggle=id=>setBuyer({...buyer,tasks:buyer.tasks.map(t=>t.id===id?{...t,status:t.status==="complete"?"not_started":"complete"}:t)});
  return <><div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:17}}><div><div style={{fontSize:9,color:"#7C8997",fontWeight:800,textTransform:"uppercase"}}>Buyer profile</div><h1 style={{margin:"4px 0",fontSize:25}}>{buyer.firstName} {buyer.lastName}</h1><div style={{fontSize:11.5,color:"#748191"}}>{buyer.homeType} · Lot {buyer.lot} · Closing {date(buyer.closingDate)}</div></div><Button primary icon={Eye} onClick={()=>setPortal(true)}>Preview buyer portal</Button></div>
    <Card style={{padding:17,marginBottom:14}}><div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr 1fr",gap:15}}>
      {[["Project",buyer.project],["Home type",buyer.homeType],["Lot",buyer.lot],["Upgrades",buyer.upgrades?.join(", ")||"None"]].map(x=><div key={x[0]}><div style={{fontSize:9.5,color:"#83909E",fontWeight:750}}>{x[0]}</div><div style={{fontSize:11.5,fontWeight:800,marginTop:4}}>{x[1]}</div></div>)}
    </div></Card>
    <div style={{display:"flex",gap:5,marginBottom:12}}>{["overview","tasks","documents"].map(x=><button key={x} onClick={()=>setTab(x)} style={{border:0,background:tab===x?"#E8EEF3":"transparent",color:tab===x?BRAND:"#718096",borderRadius:8,padding:"8px 11px",fontSize:10.5,fontWeight:800,cursor:"pointer",textTransform:"capitalize"}}>{x}</button>)}</div>
    {tab==="overview"&&<div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}><Card style={{padding:17}}><Title title="Closing readiness" sub="Calculated from required tasks"/><div style={{fontSize:30,fontWeight:850}}>{pct(buyer)}%</div><Progress value={pct(buyer)}/><div style={{fontSize:9.5,color:"#84919F",marginTop:6}}>{buyer.tasks.filter(t=>t.status==="complete").length} of {buyer.tasks.length} assigned tasks complete</div></Card><Card style={{padding:17}}><Title title="Home-specific experience" sub="What this buyer receives"/>{buyer.tasks.map(t=><div key={t.id} style={{fontSize:10.5,padding:"7px 0",borderBottom:"1px solid #EEF1F4"}}><b>{t.title}</b><span style={{color:"#8A96A3"}}> · {t.category}</span></div>)}</Card></div>}
    {tab==="tasks"&&<Card style={{padding:17}}><Title title="Assigned tasks" sub="Builder controls the requirements." action={<Button small primary icon={Plus}>Assign task</Button>}/>{buyer.tasks.map(t=><div key={t.id} style={{display:"flex",gap:10,alignItems:"center",padding:"11px 0",borderTop:"1px solid #EEF1F4"}}><div style={{width:29,height:29,borderRadius:8,background:t.status==="complete"?"#EAF6EF":"#F1F5F9",display:"grid",placeItems:"center"}}>{t.status==="complete"?<Check size={14} color="#28734A"/>:<Circle size={13} color="#8793A0"/>}</div><div style={{flex:1}}><b style={{fontSize:11}}>{t.title}</b><div style={{fontSize:9.5,color:"#8793A0"}}>{t.category} · Due {date(t.due)}</div></div>{t.status==="overdue"?<Badge tone="danger">Overdue</Badge>:t.status==="complete"?<Badge tone="success">Complete</Badge>:<Badge tone="blue">Open</Badge>}<Button small onClick={()=>toggle(t.id)}>{t.status==="complete"?"Undo":"Complete"}</Button></div>)}</Card>}
    {tab==="documents"&&<Card style={{padding:17}}><Title title="Documents" action={<Button small primary icon={Upload}>Upload</Button>}/>{buyer.documents.map(d=><div key={d.id} style={{display:"flex",gap:10,alignItems:"center",padding:"10px 0",borderTop:"1px solid #EEF1F4"}}><FileText size={15} color={BRAND}/><div style={{flex:1}}><b style={{fontSize:11}}>{d.name}</b><div style={{fontSize:9.5,color:"#8793A0"}}>{d.type}</div></div><Badge tone={d.status==="approved"?"success":"neutral"}>{d.status}</Badge></div>)}</Card>}
  </>
}

function Templates() {
  const [type,setType]=useState("Detached");
  const [templates,setTemplates]=useState(HOME_TYPES);
  const [newTask,setNewTask]=useState("");
  const add=()=>{if(!newTask.trim())return;setTemplates({...templates,[type]:[...templates[type],[newTask,"Custom builder task.","Custom"]]});setNewTask("")};
  return <><Title title="Task templates" sub="Build reusable rules that Homeward uses to personalize each buyer's portal." action={<Button primary icon={Plus}>New template</Button>}/>
    <Card style={{padding:17}}><div style={{display:"flex",gap:7,flexWrap:"wrap",marginBottom:16}}>{Object.keys(templates).map(t=><button key={t} onClick={()=>setType(t)} style={{border:"1px solid "+(type===t?BRAND:"#DCE3EA"),background:type===t?BRAND:"#fff",color:type===t?"#fff":"#526274",borderRadius:8,padding:"8px 11px",fontSize:10.5,fontWeight:800,cursor:"pointer"}}>{t}</button>)}</div><div style={{fontSize:14,fontWeight:850}}>{type} template</div><div style={{fontSize:10,color:"#84919F",margin:"3px 0 13px"}}>{templates[type].length} default tasks · Applied automatically to matching buyers</div>{templates[type].map((x,i)=><div key={i} style={{display:"flex",alignItems:"center",gap:10,padding:"11px 0",borderTop:"1px solid #EEF1F4"}}><div style={{width:25,height:25,borderRadius:7,background:"#EEF3F7",display:"grid",placeItems:"center",fontSize:9,fontWeight:850}}>{i+1}</div><div style={{flex:1}}><b style={{fontSize:11}}>{x[0]}</b><div style={{fontSize:9.5,color:"#8793A0"}}>{x[1]}</div></div><Badge>{x[2]}</Badge><ChevronRight size={14} color="#A0ACB8"/></div>)}<div style={{display:"flex",gap:7,marginTop:13}}><input value={newTask} onChange={e=>setNewTask(e.target.value)} placeholder="Add a builder-specific task..." style={{flex:1,border:"1px solid #D9E1E8",borderRadius:9,padding:"9px 10px",fontSize:10.5}}/><Button onClick={add}>Add task</Button></div></Card>
  </>
}

function Documents({buyers}) {
  const docs=buyers.flatMap(b=>b.documents.map(d=>({...d,b})));
  return <><Title title="Documents" sub="Builder documents and buyer submissions."/><Card style={{overflow:"hidden"}}>{docs.map(d=><div key={d.id+d.b.id} style={{display:"grid",gridTemplateColumns:"1.3fr 1fr 130px",padding:"13px 16px",borderBottom:"1px solid #EEF1F4",alignItems:"center"}}><div style={{display:"flex",gap:9,alignItems:"center"}}><FileText size={15} color={BRAND}/><div><b style={{fontSize:11}}>{d.name}</b><div style={{fontSize:9.5,color:"#8793A0"}}>{d.type}</div></div></div><div style={{fontSize:10.5}}>{d.b.firstName} {d.b.lastName}</div><Badge tone={d.status==="approved"?"success":"neutral"}>{d.status}</Badge></div>)}</Card></>
}

function Messages() {
  return <><Title title="Messages" sub="Keep buyer communication connected to the closing journey."/><Card style={{padding:20,maxWidth:760}}><div style={{padding:14,background:"#F2F6F9",borderRadius:10,fontSize:11,color:"#566577"}}><b>Michael Chen</b><br/><span style={{display:"block",marginTop:5}}>I'm waiting for my lender to send the final commitment. Is there anything else I can complete?</span></div><div style={{display:"flex",gap:7,marginTop:12}}><input placeholder="Reply to buyer..." style={{flex:1,border:"1px solid #D9E1E8",borderRadius:9,padding:10,fontSize:11}}/><Button primary icon={Send}>Send</Button></div></Card></>
}

function Projects() {
  return <><Title title="Projects" sub="Define communities and the home types available within them." action={<Button primary icon={Plus}>New project</Button>}/><div style={{display:"grid",gridTemplateColumns:"repeat(2,1fr)",gap:14}}>{["Maple Ridge","Cedar Heights"].map((x,i)=><Card key={x} style={{padding:18}}><Building2 size={20} color={BRAND}/><h3 style={{margin:"12px 0 3px",fontSize:15}}>{x}</h3><div style={{fontSize:10,color:"#84919F"}}>{i?32:48} homes · {i?2:4} home types</div><div style={{marginTop:14,fontSize:10.5,color:"#526274"}}>Detached · Semi-Detached · Townhome · Condo</div></Card>)}</div></>
}

function SettingsPage() {
  return <><Title title="Builder settings" sub="Configure the Homeward experience for your company."/><Card style={{padding:20,maxWidth:700}}>{["Builder / company name","Buyer portal tagline","Support email","Default closing task lead time"].map((x,i)=><div key={x} style={{marginBottom:14}}><label style={{fontSize:10,fontWeight:800,color:"#718096",display:"block",marginBottom:5}}>{x}</label><input defaultValue={i===0?"Northstar Homes":i===1?"A better path to closing.":i===2?"support@northstarhomes.ca":"30 days"} style={{width:"100%",border:"1px solid #D9E1E8",borderRadius:9,padding:10,fontSize:11}}/></div>)}<Button primary>Save changes</Button></Card></>
}

function BuyerPortal({buyer,setBuyer,onExit}) {
  const [tab,setTab]=useState("home");
  const [open,setOpen]=useState(null);
  const complete=buyer.tasks.filter(t=>t.status==="complete").length;
  const progress=pct(buyer);
  const next=buyer.tasks.find(t=>t.status!=="complete");
  const toggle=id=>setBuyer({...buyer,tasks:buyer.tasks.map(t=>t.id===id?{...t,status:t.status==="complete"?"not_started":"complete"}:t)});
  return <div style={{minHeight:"100vh",background:"#F5F7F9"}}><div style={{maxWidth:520,minHeight:"100vh",margin:"0 auto",background:"#F7F8FA",boxShadow:"0 0 35px rgba(15,23,42,.08)"}}>
    <header style={{background:"#fff",borderBottom:"1px solid #E5E9EE",padding:"14px 18px",display:"flex",alignItems:"center",gap:10}}><div style={{width:34,height:34,borderRadius:9,background:BRAND,display:"grid",placeItems:"center"}}><Home size={17} color="#fff"/></div><div style={{flex:1}}><b style={{fontSize:14}}>Homeward</b><div style={{fontSize:8.5,color:"#84919F"}}>YOUR HOMEOWNER PORTAL</div></div><Bell size={17} color="#778594"/><button onClick={onExit} style={{border:0,background:"none",fontSize:9,color:"#718096",cursor:"pointer"}}>Builder view</button></header>
    <div style={{padding:"20px 18px 30px"}}><div style={{fontSize:9.5,color:"#778594",fontWeight:800,textTransform:"uppercase"}}>{buyer.project} · Lot {buyer.lot}</div><h1 style={{fontSize:24,margin:"5px 0"}}>Hi, {buyer.firstName}.</h1><div style={{fontSize:11,color:"#778594",marginBottom:15}}>Here's your personalized path to closing.</div>
      <Card style={{padding:17,background:"linear-gradient(135deg,#102A40,#1C4665)",color:"#fff",border:0}}><div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}><div><div style={{fontSize:9,color:"#B6C7D7"}}>CLOSING DATE</div><div style={{fontSize:21,fontWeight:850,marginTop:3}}>{date(buyer.closingDate)}</div><div style={{fontSize:9.5,color:"#B6C7D7",marginTop:4}}>{days(buyer.closingDate)} days to go</div></div><div style={{width:65,height:65,borderRadius:"50%",border:"5px solid rgba(255,255,255,.16)",display:"grid",placeItems:"center",fontSize:16,fontWeight:850}}>{progress}%</div></div></Card>
      <div style={{display:"flex",gap:5,margin:"15px 0"}}>{["home","tasks","documents","messages"].map(x=><button key={x} onClick={()=>setTab(x)} style={{flex:1,border:0,borderRadius:8,padding:9,background:tab===x?"#E8EEF3":"transparent",color:tab===x?BRAND:"#7B8795",fontSize:9.5,fontWeight:800,cursor:"pointer"}}>{x==="home"?"Home":x==="tasks"?"My tasks":x==="documents"?"Documents":"Messages"}</button>)}</div>
      {tab==="home"&&<><Card style={{padding:15,marginBottom:12}}><b style={{fontSize:12.5}}>Your next step</b>{next?<div style={{marginTop:10,border:"1px solid #E5EAF0",borderRadius:10,padding:12}}><div style={{fontSize:11.5,fontWeight:800}}>{next.title}</div><div style={{fontSize:10,color:"#748191",lineHeight:1.45,marginTop:5}}>{next.description}</div><Button primary style={{marginTop:10,width:"100%"}} onClick={()=>{setTab("tasks");setOpen(next.id)}}>Open task</Button></div>:<div style={{marginTop:9,padding:11,background:"#EAF6EF",borderRadius:9,fontSize:10.5,color:"#28734A",fontWeight:700}}>You're closing ready.</div>}</Card><Card style={{padding:15}}><div style={{display:"flex",justifyContent:"space-between"}}><div><b style={{fontSize:12.5}}>Your Homeward journey</b><div style={{fontSize:9.5,color:"#8793A0",marginTop:3}}>{complete} of {buyer.tasks.length} tasks complete</div></div><b>{progress}%</b></div><div style={{marginTop:10}}><Progress value={progress}/></div></Card></>}
      {tab==="tasks"&&<><Title title="My tasks" sub="Only tasks that apply to your home are shown."/><div style={{display:"grid",gap:8}}>{buyer.tasks.map(t=><Card key={t.id} style={{padding:12}}><button onClick={()=>setOpen(open===t.id?null:t.id)} style={{width:"100%",border:0,background:"none",display:"flex",alignItems:"center",gap:10,textAlign:"left",cursor:"pointer"}}><div style={{width:30,height:30,borderRadius:8,background:t.status==="complete"?"#EAF6EF":"#EEF3F7",display:"grid",placeItems:"center"}}>{t.status==="complete"?<Check size={14} color="#28734A"/>:<Circle size={13} color="#84919F"/>}</div><div style={{flex:1}}><b style={{fontSize:11}}>{t.title}</b><div style={{fontSize:9,color:t.status==="overdue"?"#B42318":"#8793A0",marginTop:3}}>{t.status==="complete"?"Completed":t.status==="overdue"?"Overdue":"Due "+date(t.due)}</div></div><ChevronDown size={14}/></button>{open===t.id&&<div style={{borderTop:"1px solid #EEF1F4",marginTop:10,paddingTop:10}}><div style={{fontSize:10,color:"#657384",lineHeight:1.5}}>{t.description}</div>{["Financing","Insurance","Documents"].includes(t.category)&&<div style={{border:"1px dashed #CBD5E1",borderRadius:9,padding:13,textAlign:"center",marginTop:10,fontSize:9.5,color:"#718096"}}><Upload size={15}/><br/>Upload document</div>}<Button primary style={{width:"100%",marginTop:9}} onClick={()=>toggle(t.id)}>{t.status==="complete"?"Mark incomplete":"Mark complete"}</Button></div>}</Card>)}</div></>}
      {tab==="documents"&&<><Title title="Documents" sub="Everything relevant to your purchase."/><div style={{display:"grid",gap:8}}>{buyer.documents.map(d=><Card key={d.id} style={{padding:12,display:"flex",gap:9,alignItems:"center"}}><FileText size={16} color={BRAND}/><div style={{flex:1}}><b style={{fontSize:11}}>{d.name}</b><div style={{fontSize:9,color:"#8793A0"}}>{d.type}</div></div><Badge tone={d.status==="approved"?"success":"neutral"}>{d.status}</Badge></Card>)}<Button primary icon={Upload} style={{width:"100%"}}>Upload a document</Button></div></>}
      {tab==="messages"&&<><Title title="Messages" sub="Ask your builder a question."/><Card style={{padding:14}}><div style={{fontSize:10.5,color:"#59697A",background:"#F1F5F9",padding:11,borderRadius:9,lineHeight:1.5}}>Your builder can respond directly from their Homeward workspace.</div><textarea placeholder="Write a question..." style={{width:"100%",height:100,marginTop:9,border:"1px solid #D9E1E8",borderRadius:9,padding:10,fontSize:10.5,resize:"none"}}/><Button primary icon={Send} style={{width:"100%",marginTop:8}}>Send message</Button></Card></>}
    </div><footer style={{padding:"15px",textAlign:"center",fontSize:8.5,color:"#94A0AD",borderTop:"1px solid #E5E9EE"}}>Homeward beta · Powered by your builder</footer>
  </div></div>
}

export default function HomewardBeta(){
  const [buyers,setBuyers]=useState(seedBuyers);
  const [selected,setSelected]=useState(null);
  const [page,setPage]=useState("dashboard");
  const [portal,setPortal]=useState(false);
  const buyer=buyers.find(b=>b.id===selected)||buyers[0];
  const setBuyer=b=>setBuyers(bs=>bs.map(x=>x.id===b.id?b:x));
  if(portal) return <BuyerPortal buyer={buyer} setBuyer={setBuyer} onExit={()=>setPortal(false)}/>;
  const content=useMemo(()=>{
    if(page==="dashboard")return <BuilderDashboard buyers={buyers} setPage={setPage}/>;
    if(page==="buyers")return <Buyers buyers={buyers} setSelected={id=>{setSelected(id);setPage("buyer")}}/>;
    if(page==="buyer")return <BuyerProfile buyer={buyer} setBuyer={setBuyer} setPortal={setPortal}/>;
    if(page==="tasks")return <Templates/>;
    if(page==="documents")return <Documents buyers={buyers}/>;
    if(page==="messages")return <Messages/>;
    if(page==="projects")return <Projects/>;
    return <SettingsPage/>;
  },[page,buyers,buyer]);
  return <div style={{minHeight:"100vh",background:"#F5F7FA",fontFamily:"Inter,ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif",color:"#172033"}}><Sidebar page={page} setPage={setPage}/><main style={{marginLeft:235,minHeight:"100vh"}}><header style={{height:62,background:"#fff",borderBottom:"1px solid #E3E8EE",display:"flex",alignItems:"center",justifyContent:"space-between",padding:"0 24px"}}><div><div style={{fontSize:9,color:"#84919F",fontWeight:800,textTransform:"uppercase",letterSpacing:.8}}>Builder workspace</div><div style={{fontSize:14,fontWeight:850,marginTop:2}}>Northstar Homes</div></div><Button small primary icon={Eye} onClick={()=>setPortal(true)}>Preview buyer portal</Button></header><div style={{maxWidth:1120,margin:"0 auto",padding:"26px 24px 50px"}}>{content}</div></main><style>{`@media(max-width:760px){aside{display:none}main{margin-left:0!important}header{padding:0 14px!important}}`}</style></div>
}
