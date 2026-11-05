const fs=require('fs'),T=require('./vendor/three.min.js'),create=require('./model.js'),assert=require('assert');
const out=__dirname+'/dist';
fs.mkdirSync(out,{recursive:true});
const fragment=fs.readFileSync(__dirname+'/fragment.html','utf8');
const scripts=['vendor/three.min.js','vendor/OrbitControls.js','model.js','viewer.js'].map(p=>'<script>'+fs.readFileSync(__dirname+'/'+p,'utf8')+'</script>').join('\n');
const css=`:root{color-scheme:light;--background:#f4f1ea;--foreground:#333c36;--font-size-base:14px;--border:#d4d4c9;--primary:#414e44;--primary-foreground:#fff}*{box-sizing:border-box}body{margin:0;background:var(--background);color:var(--foreground);font:14px/1.5 Arial,sans-serif}main{max-width:1180px;margin:auto;padding:24px}h1{font-size:25px;font-weight:500;margin:0 0 4px}.intro{margin:0 0 18px;color:#5a625a}.btn,select{font:inherit;color:inherit;background:#fffdf8;border:1px solid var(--border);border-radius:7px;padding:8px 11px}.btn{cursor:pointer}.btn[aria-pressed=true]{background:var(--primary);color:var(--primary-foreground)}.btn:focus-visible,select:focus-visible,input:focus-visible{outline:3px solid #8eab8d;outline-offset:3px}.form-check{display:flex;gap:6px;align-items:center}.form-select{width:100%}.text-small{font-size:12px}.notes{border-top:1px solid var(--border);margin-top:16px;padding-top:14px;max-width:850px}.notes p{margin:6px 0}.notes strong{font-weight:600}@media(max-width:500px){main{padding:14px}.btn,select{min-height:44px}.intro{font-size:13px}}`;
const notes=`<div class="notes"><p><strong>Двери:</strong> входная дверь и дверь санузла показаны закрытыми. Открывание сохранено: входная — наружу, санузел — в прихожую. Зеркала на раздвижных дверях гардеробной.</p><p><strong>Ванная:</strong> рядом со стиральной машиной в правом нижнем углу добавлен узкий пенал до потолка: фасад 35 см, глубина 30 см, высота 270 см. Люк машины обращён к центру ванной. Умывальник немного сдвинут к левому нижнему углу, чтобы освободить доступ к машине и пеналу.</p><p><strong>Гостиная:</strong> обеденный стол Ø 90 см придвинут вплотную к верхней стене между кухней и диваном; оба стула задвинуты под стол с боков. Полка под телевизором убрана. Компьютерный стол 120 × 80 см сдвинут влево вплотную к стене у окна без разворота.</p><p><strong>Детская:</strong> оба матраса 80 × 180 см, кровати без боковых бортиков. Кровать возле стола развёрнута ногами к окну. Тумбочка с лампой и игрушки из центра убраны. Комод — у первой кровати, шкаф-купе — у двери.</p><p><strong>Отделка по вашим фото:</strong> светлые серо-бежевые стены, светлый пол под выбеленное дерево, белые двери, оконные рамы и плинтусы. В ванной — серая плитка. Цвета подобраны визуально по изображениям.</p><p><strong>Диван по референсу:</strong> 227 × 110 × 95 см, светло-серая обивка, высокая простёганная спинка, широкие подлокотники, две подушки и тёмные ножки. Схематическая модель повторяет основные пропорции.</p><p><strong>Кухня:</strong> прежние светло-серые фасады и пеналы, прежняя столешница. Планировка и состав техники сохранены.</p><p><strong>Размеры:</strong> детская 5,20 × 2,80 м; гардеробная около 1,58 × 1,80 м; потолок 2,70 м. Это концепция по фотографии: перед заказом мебели нужны обмеры проёмов, радиаторов и выводов, проверка открывания дверей и выдвижения стульев.</p></div>`;
fs.writeFileSync(__dirname+'/index.html','<!doctype html><html lang="ru"><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Квартира · 3D-планировка</title><style>'+css+'</style><main><h1>Квартира · 43,2 м²</h1><p class="intro">Обновлённая планировка · две детские кровати · стол 120 × 80 см</p>'+fragment+scripts+notes+'</main></html>');

// A small glTF exporter keeps the delivered model independent of any editor.
function exportGLB(model,path){
  model.root.updateMatrixWorld(true);
  const doc={asset:{version:'2.0',generator:'Apartment concept · metres'},scene:0,scenes:[{nodes:[]}],nodes:[],meshes:[],materials:[],accessors:[],bufferViews:[],buffers:[{byteLength:0}]},chunks=[];let offset=0;
  const geomMap=new Map(),materialMap=new Map();
  function data(array,type,componentType,target){const raw=Buffer.from(array.buffer,array.byteOffset,array.byteLength),pad=(4-raw.length%4)%4,view=doc.bufferViews.length;doc.bufferViews.push({buffer:0,byteOffset:offset,byteLength:raw.length,target});chunks.push(raw,Buffer.alloc(pad));offset+=raw.length+pad;const a={bufferView:view,componentType,count:array.length/({SCALAR:1,VEC2:2,VEC3:3}[type]),type};if(type==='VEC3'&&target===34962){a.min=[Infinity,Infinity,Infinity];a.max=[-Infinity,-Infinity,-Infinity];for(let i=0;i<array.length;i++){let j=i%3;a.min[j]=Math.min(a.min[j],array[i]);a.max[j]=Math.max(a.max[j],array[i]);}}doc.accessors.push(a);return doc.accessors.length-1;}
  function mat(m){if(materialMap.has(m.uuid))return materialMap.get(m.uuid);const id=doc.materials.length;doc.materials.push({name:m.name||'material',pbrMetallicRoughness:{baseColorFactor:[m.color.r,m.color.g,m.color.b,1],metallicFactor:m.metalness,roughnessFactor:m.roughness}});materialMap.set(m.uuid,id);return id;}
  function node(o){const n={name:o.name||o.type,translation:o.position.toArray(),rotation:o.quaternion.toArray(),scale:o.scale.toArray()},id=doc.nodes.length;doc.nodes.push(n);if(o.isMesh){let key=o.geometry.uuid+o.material.uuid;if(!geomMap.has(key)){const g=o.geometry,attributes={POSITION:data(g.attributes.position.array,'VEC3',5126,34962),NORMAL:data(g.attributes.normal.array,'VEC3',5126,34962)},primitive={attributes,material:mat(o.material)};if(g.index)primitive.indices=data(g.index.array,'SCALAR',g.index.array instanceof Uint32Array?5125:5123,34963);const mesh=doc.meshes.length;doc.meshes.push({primitives:[primitive]});geomMap.set(key,mesh);}n.mesh=geomMap.get(key);}if(o.userData.detail)n.extras={description:o.userData.detail};if(o.children.length)n.children=o.children.map(node);return id;}
  doc.scenes[0].nodes.push(node(model.root));doc.buffers[0].byteLength=offset;
  const j=Buffer.from(JSON.stringify(doc)),jp=Buffer.alloc((4-j.length%4)%4,32),json=Buffer.concat([j,jp]),bin=Buffer.concat(chunks),header=Buffer.alloc(12),jh=Buffer.alloc(8),bh=Buffer.alloc(8);header.writeUInt32LE(0x46546c67);header.writeUInt32LE(2,4);header.writeUInt32LE(28+json.length+bin.length,8);jh.writeUInt32LE(json.length);jh.writeUInt32LE(0x4e4f534a,4);bh.writeUInt32LE(bin.length);bh.writeUInt32LE(0x004e4942,4);fs.writeFileSync(path,Buffer.concat([header,jh,json,bh,bin]));
  return doc;
}
const model=create(T);let meshCount=0;model.root.traverse(o=>{if(o.isMesh){meshCount++;assert([...o.position.toArray(),...o.scale.toArray()].every(Number.isFinite));assert(o.scale.x>0&&o.scale.y>0&&o.scale.z>0);}});
assert(meshCount>250);assert.equal(model.zones.nursery.name,'Детская 14,6 м²');assert.equal(model.walls[0].userData.wallHeight,2.7);
const boundsOf=name=>new T.Box3().setFromObject(model.root.getObjectByName(name));
assert.equal(model.root.getObjectByName('Прихожая').children.length,0,'No furniture in the entrance');
const hasWallAt=(x,z)=>model.walls.some(w=>{const p=w.geometry.parameters;return w.userData.wallBase<1&&Math.abs(x-w.position.x)<p.width/2&&Math.abs(z-w.position.z)<p.depth/2;});
assert(!hasWallAt(6.87,2.23),'Bathroom doorway must connect to the hall');
assert(hasWallAt(7.31,2.82),'Outside wall of the bathroom must be closed');
assert(!hasWallAt(6.87,3.45),'Entrance opening must remain clear');
for(const [name,length] of [['Входная дверь',.94],['Дверь санузла',.8]]){const size=boundsOf(name).getSize(new T.Vector3());assert(size.x<.09&&Math.abs(size.z-length)<.001,name+' is closed in its doorway');}
assert(!boundsOf('Дверь санузла').intersectsBox(boundsOf('Умывальник')),'Bathroom door clears the basin');
assert.equal(model.root.getObjectByName('Зеркальные двери гардеробной').parent,model.zones.wardrobe);
assert(Math.abs(boundsOf('Рабочее место').min.x)<.001,'PC desk is flush with the window-side wall');
assert.equal(model.root.getObjectByName('Рабочее место').rotation.y,0,'PC desk keeps its orientation');
const pcSize=boundsOf('Рабочее место').getSize(new T.Vector3());assert(Math.abs(pcSize.x-1.2)<.001&&Math.abs(pcSize.z-.8)<.001,'PC desk measures 120 × 80 cm');
const firstBed=boundsOf('Детская кровать 80 × 180'),secondBed=boundsOf('Вторая детская кровать 80 × 180');
assert(firstBed.getSize(new T.Vector3()).distanceTo(secondBed.getSize(new T.Vector3()))<.0001,'Both beds have matching dimensions');
assert(Math.abs(firstBed.getSize(new T.Vector3()).z-.88)<.001,'Bed frame fits an 80 cm mattress');
const second=model.root.getObjectByName('Вторая детская кровать 80 × 180');assert(second.getObjectByName('Изголовье').getWorldPosition(new T.Vector3()).x>secondBed.getCenter(new T.Vector3()).x+.8,'Second bed points feet toward the window');
const nurseryFurniture=['Детская кровать 80 × 180','Вторая детская кровать 80 × 180','Растущий стол','Детский комод','Шкаф-купе у двери'];
assert(!model.root.getObjectByName('Тумба')&&!model.root.getObjectByName('Игровая зона'),'Nightstand, lamp and central toys are removed');
for(let i=0;i<nurseryFurniture.length;i++)for(let j=i+1;j<nurseryFurniture.length;j++)assert(!boundsOf(nurseryFurniture[i]).intersectsBox(boundsOf(nurseryFurniture[j])),nurseryFurniture[i]+' overlaps '+nurseryFurniture[j]);
const dining=model.root.getObjectByName('Круглый стол и два стула');assert.equal(dining.children.filter(o=>o.name==='Обеденный стул').length,2);
assert(Math.abs(boundsOf(dining.name).min.z)<.001,'Dining tabletop touches the upper wall');
const diningCenter=new T.Vector3(3.12,0,1.6).add(dining.position);for(const c of dining.children.filter(o=>o.name==='Обеденный стул'))assert(Math.abs(c.getWorldPosition(new T.Vector3()).distanceTo(new T.Vector3(diningCenter.x,0,diningCenter.z))-.45)<.001,'Chairs are tucked under the tabletop');
assert(boundsOf('Диван').max.x<boundsOf(dining.name).min.x&&boundsOf(dining.name).max.x<new T.Box3().setFromObject(model.zones.kitchen).min.x,'Dining table is between the sofa and kitchen');
assert(!boundsOf(dining.name).intersectsBox(boundsOf('Рабочее место')),'Dining group clears the PC desk');
assert(!model.root.getObjectByName('Тумба под ТВ'));
for(const name of ['Стиральная машина','Умывальник','Ванна'])assert(!boundsOf('Пенал для ванной').intersectsBox(boundsOf(name)),'Bathroom cabinet clears '+name);
assert(Math.abs(boundsOf('Пенал для ванной').max.y-2.7)<.001,'Bathroom cabinet reaches the ceiling');
assert(!model.root.getObjectByName('Растение')&&!model.root.getObjectByName('Приставной столик'));
const sofa=model.root.getObjectByName('Диван'),sofaBounds=boundsOf('Диван'),sofaSize=sofaBounds.getSize(new T.Vector3());
assert(Math.abs(sofaSize.x-2.27)<.001&&Math.abs(sofaSize.z-1.10)<.001&&Math.abs(sofaBounds.max.y-.95)<.001,'Sofa follows the reference dimensions');
sofa.traverse(o=>{if(o.isMesh)assert(o.geometry.attributes.position.array.every(Number.isFinite),'Rounded upholstery geometry is finite');});
assert(!sofaBounds.intersectsBox(boundsOf('Компьютерное кресло')),'Larger sofa clears the PC chair');
assert.equal(model.colors.kitchen,0xcbd0d4,'Kitchen finish remains unchanged');
const doc=exportGLB(model,out+'/apartment-wall.glb');assert.equal(doc.nodes.filter(n=>n.mesh!==undefined).length,meshCount);const buf=fs.readFileSync(out+'/apartment-wall.glb');assert.equal(buf.readUInt32LE(8),buf.length);
const names=model.pickable.map(o=>o.name);['Пенал: духовка и микроволновка','Холодильник','Посудомоечная машина','Детская кровать 80 × 180','Шкаф-купе у двери'].forEach(n=>assert(names.includes(n)));
console.log(JSON.stringify({meshes:meshCount,htmlBytes:fs.statSync(__dirname+'/index.html').size,glbBytes:fs.statSync(out+'/apartment-wall.glb').size,checks:'passed'}));
