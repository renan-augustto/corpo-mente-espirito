// Run: node tests/logic.cjs. Tests core logic in isolation, not a browser.
const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict'),path=require('node:path');
async function main() {
const constants=await import('../src/config/constants.mjs');
const dates=await import('../src/utils/dates.mjs');
const models=await import('../src/models/routine.mjs');
const storage=await import('../src/services/storage.mjs');
const code=fs.readFileSync(path.join(__dirname,'../app.js'),'utf8').replace(/^import .*;$/gm,'');
const context=vm.createContext({...constants,...dates,fresh:models.fresh,validTask:models.validTask,validate:models.validate,task:models.task,modelDue:models.due,modelIsDone:models.isDone,modelStat:models.stat,percentage:models.percentage,isActive:models.isActive,modelRetire:models.retire,modelReplaceTask:models.replaceTask,replacePlan:models.replacePlan,...storage,console,Date,TextEncoder,FormData,crypto:require('node:crypto').webcrypto,localStorage:{getItem:()=>null,setItem:()=>{}},document:{addEventListener:()=>{}},window:{addEventListener:()=>{}},location:{hash:''}});
vm.runInContext(code.slice(0,code.lastIndexOf('\nrender();')),context);
vm.runInContext(`globalThis.test=()=>{const d=today();const t=task('Teste','body','10:00',15);state.tasks=[t];const initial=stat(d);state.done[d]=[t.id];const completed=stat(d);const t2=task('Histórico','mind','11:00',20,all,shift(d,-2));state.tasks.push(t2);replaceTask(t2,task('Novo','mind','12:00',20));let f=new FormData();for(const [k,v] of Object.entries({name:'Teste',wake:'08:00',bed:'22:00',available:'20',energy:'low'}))f.set(k,v);for(const g of ['job','study','exercise','read'])f.append('goals',g);let plan=planFrom(f);return {initial,completed,history:due(shift(d,-1)).map(x=>x.name),now:due(d).map(x=>x.name),pillars:[...new Set(plan.list.map(x=>x.pillar))],budget:plan.list.reduce((n,x)=>n+x.minutes,0),valid:validate(state).version,invalid:validTask({...t,time:'25:00'}),escape:esc('<script>'),fold:fold('A'.repeat(90)),phase:phase().title}}`,context);
const r=JSON.parse(JSON.stringify(vm.runInContext('test()',context)));
assert.deepEqual(r.initial,{n:1,d:0});assert.deepEqual(r.completed,{n:1,d:1});assert.deepEqual(r.history,['Histórico']);assert.deepEqual(r.now,['Teste','Novo']);assert.deepEqual(r.pillars,['mind','body','spirit']);assert.ok(r.budget<=25);assert.equal(r.valid,1);assert.equal(r.invalid,false);assert.equal(r.escape,'&lt;script&gt;');assert.ok(r.fold.includes('\r\n '));assert.equal(r.phase,'Fundação');console.log('PASS: recurrence, completion, historical edits, onboarding budget, validation, escaping, ICS folding, phases.');

// Direct tests for extracted model, including recurrence and independent dates.
const state=models.fresh(), day=dates.today(), previous=dates.shift(day,-1);
const recurring=models.task('Regression','body','09:00',10,constants.all,previous);
state.tasks.push(recurring);
state.done[previous]=[recurring.id];
assert.deepEqual(models.stat(state,previous),{n:1,d:1});
assert.deepEqual(models.stat(state,day),{n:1,d:0});
assert.equal(models.validate(state).version,1);
assert.equal(dates.validDate('2026-02-30'),false);
console.log('PASS: extracted model and date contracts.');

// Explicit date fixtures for same-day history and storage.
const d='2026-11-27', y=dates.shift(d,-1), tomorrow=dates.shift(d,1);
const s=models.fresh(); s.start=y;
const old=models.task('Concluída','body','08:00',10,constants.all,y);
s.tasks.push(old); s.done[y]=[old.id];s.done[d]=[old.id];
models.replaceTask(s,old,models.task('Editada','mind','09:00',15,constants.all,d),d);
assert.deepEqual(models.stat(s,y),{n:1,d:1});
assert.deepEqual(models.stat(s,d),{n:1,d:1});
assert.deepEqual(models.stat(s,tomorrow),{n:1,d:0});
assert.equal(models.due(s,d)[0].name,'Concluída');
assert.equal(models.due(s,tomorrow)[0].name,'Editada');
assert.equal(models.isActive(old,d),false);
const same=models.task('Encerrar hoje','body','10:00',10,constants.all,d);
s.tasks.push(same);s.done[d].push(same.id);
models.retire(s,same,d);
assert.equal(models.due(s,d).some(t=>t.id===same.id),true);
assert.equal(models.due(s,tomorrow).some(t=>t.id===same.id),false);
const pending=models.task('Pendente','body','11:00',10,constants.all,d);
s.tasks.push(pending);models.retire(s,pending,d);
assert.equal(s.tasks.some(t=>t.id===pending.id),false);
models.replacePlan(s,{name:'Teste',list:[models.task('Novo plano','spirit','12:00',10,constants.all,d)]},d);
assert.deepEqual(models.stat(s,d),{n:2,d:2});
assert.equal(models.due(s,tomorrow).length,1);
assert.equal(models.due(s,tomorrow)[0].name,'Novo plano');
const clean=models.fresh();
models.replacePlan(clean,{name:'Teste',list:[models.task('Hoje','mind','12:00',10,constants.all,d)]},d);
assert.equal(models.due(clean,d).length,1);
let raw=null; const fake={getItem:k=>raw,setItem:(k,v)=>{assert.equal(k,'cme-v1');raw=v;}};
storage.persistState(fake,s);
assert.deepEqual(storage.loadState(fake),models.validate(s));
assert.equal(models.validate(s).version,1);
console.log('PASS: same-day edit, retire, replan and local storage regression.');

}
main().catch(error=>{console.error(error);process.exitCode=1;});
