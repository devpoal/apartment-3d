/* Dimensions in metres; image coordinates: x to the right, z downward. */
function createApartment(T) {
  const root=new T.Group(); root.name='Квартира 43,2 м² · концепция';
  const walls=[], pickable=[], zones={}, mats={};
  const colors={wall:0xdcd8cf,trim:0xf2f1ed,bathWall:0xaaa8a0,bathFloor:0xa9aaa3,grout:0x92938d,darkWood:0x51443b,oak:0xb8976e,wood:0xceae86,cream:0xf2ede3,sage:0xb6b6ad,sofa:0xaaa8aa,sofaPillow:0xb5b2b4,floor:0xd7d3c9,floorSeam:0xc5c0b7,kitchen:0xcbd0d4,mirror:0xc2cdd6,ink:0x323d41,metal:0x6b6d66,glass:0xb9d4db,linen:0xe4d4bb,rug:0xd4d1ca,child:0xbfc3c2,terracotta:0xbf896c,tile:0xd1d4d7,leaf:0x6e8961,white:0xf4f0e8};
  Object.entries(colors).forEach(([k,c])=>{mats[k]=new T.MeshStandardMaterial({name:k,color:c,roughness:k==='mirror'?.18:k==='metal'?.4:.84,metalness:k==='mirror'?.25:k==='metal'?.45:0});mats[k].color.convertSRGBToLinear();});
  function group(name,detail,parent=root){const g=new T.Group();g.name=name;g.userData.detail=detail;parent.add(g);if(detail)pickable.push(g);return g;}
  function box(g,x,y,z,w,h,d,m='cream',ry=0){const o=new T.Mesh(new T.BoxGeometry(w,h,d),mats[m]);o.position.set(x,y+h/2,z);o.rotation.y=ry;o.castShadow=true;o.receiveShadow=true;g.add(o);return o;}
  function softBox(g,x,y,z,w,h,d,r,m='sofa'){
    const geometry=new T.BoxGeometry(w,h,d,12,8,8),p=geometry.attributes.position,n=geometry.attributes.normal;
    for(let i=0;i<p.count;i++){const v=new T.Vector3().fromBufferAttribute(p,i),inner=new T.Vector3(T.MathUtils.clamp(v.x,-w/2+r,w/2-r),T.MathUtils.clamp(v.y,-h/2+r,h/2-r),T.MathUtils.clamp(v.z,-d/2+r,d/2-r)),normal=v.clone().sub(inner).normalize();v.copy(inner).addScaledVector(normal,r);p.setXYZ(i,v.x,v.y,v.z);n.setXYZ(i,normal.x,normal.y,normal.z);}
    const o=new T.Mesh(geometry,mats[m]);o.position.set(x,y+h/2,z);o.castShadow=true;o.receiveShadow=true;g.add(o);return o;
  }
  function cyl(g,x,y,z,r,h,m='wood',r2=r,n=32){const o=new T.Mesh(new T.CylinderGeometry(r2,r,h,n),mats[m]);o.position.set(x,y+h/2,z);o.castShadow=true;o.receiveShadow=true;g.add(o);return o;}
  function ball(g,x,y,z,rx,ry,rz,m){const o=new T.Mesh(new T.SphereGeometry(1,16,10),mats[m]);o.position.set(x,y,z);o.scale.set(rx,ry,rz);o.castShadow=true;g.add(o);return o;}
  function rod(g,a,b,r,m='metal'){const va=new T.Vector3(...a),vb=new T.Vector3(...b),o=cyl(g,0,0,0,r,va.distanceTo(vb),m,r,10);o.position.copy(va.clone().add(vb).multiplyScalar(.5));o.quaternion.setFromUnitVectors(new T.Vector3(0,1,0),vb.sub(va).normalize());return o;}
  function wall(x,z,w,d,base=0,h=2.7,m='wall'){const o=box(root,x,base,z,w,h,d,m);o.name='Стена';o.userData.wallBase=base;o.userData.wallHeight=h;walls.push(o);if(base===0&&h===2.7&&m==='wall'){if(w>d){[-1,1].forEach(s=>box(root,x,0,z+s*(d/2+.008),w,.075,.016,'trim'));}else{[-1,1].forEach(s=>box(root,x+s*(w/2+.008),0,z,.016,.075,d,'trim'));}}return o;}
  const floors=group('Полы');
  box(floors,3.39,-.16,2.935,6.78,.16,5.87,'floor');
  box(floors,7.615,-.16,1.365,1.67,.16,2.73,'bathFloor');
  box(floors,5.99,.002,3.835,1.58,.012,4.07,'tile');
  box(floors,4.865,.004,.9,2.43,.012,1.8,'tile');
  for(let x=7.38;x<8.45;x+=.6)box(floors,x,.003,1.365,.006,.005,2.73,'grout');
  for(let z=.6;z<2.73;z+=.6)box(floors,7.615,.003,z,1.67,.005,.006,'grout');
  // Thin parquet seams make the floor readable without texture downloads.
  for(let z=.15;z<5.87;z+=.22)box(floors,2.6,.004,z,5.2,.006,.006,'floorSeam');
  for(let x=.8;x<5.2;x+=.9)for(let z=.15;z<5.87;z+=.44)box(floors,x,.004,z+.11,.006,.006,.215,'floorSeam');
  for(let x=5.2;x<6.78;x+=.4)box(floors,x,.017,3.835,.006,.005,4.07,'cream');
  for(let z=1.8;z<5.87;z+=.4)box(floors,5.99,.017,z,1.58,.005,.006,'cream');
  wall(3.345,-.09,6.87,.18);wall(7.66,-.09,1.76,.18,0,2.7,'bathWall');wall(3.39,5.96,6.96,.18);
  wall(-.09,.28,.18,.56);wall(-.09,2.98,.18,1.16);wall(-.09,5.635,.18,.47);
  [[.56,2.4],[3.56,5.4]].forEach(([a,b])=>{wall(-.09,(a+b)/2,.18,b-a,0,.8);wall(-.09,(a+b)/2,.18,b-a,2.25,.45);
    const g=group('Окно','Окна восстановлены по фотографии; высота подоконника принята 80 см.');
    box(g,-.085,.8,(a+b)/2,.08,1.45,b-a,'glass');box(g,.04,.78,(a+b)/2,.3,.04,b-a+.12,'trim');
    [a,b,(a+b)/2].forEach(z=>box(g,-.02,.8,z,.09,1.45,.045,'trim'));box(g,-.02,2.21,(a+b)/2,.09,.045,b-a,'trim');
    const radiator=group('Радиатор',null,g);box(radiator,.06,.15,(a+b)/2,.13,.48,1.1,'cream');for(let zz=-.48;zz<.5;zz+=.09)box(radiator,.135,.17,(a+b)/2+zz,.018,.44,.024,'white');
  });
  wall(8.54,1.365,.18,2.91,0,2.7,'bathWall');wall(7.65,2.82,1.78,.18,0,2.7,'bathWall');
  wall(6.87,.87,.18,1.92,0,2.7,'bathWall');wall(6.87,2.725,.18,.19,0,2.7,'bathWall');wall(6.87,2.23,.18,.8,2.08,.62,'bathWall'); // bathroom door opens from the hall, z 1.83–2.63
  wall(6.87,4.985,.18,1.95); // external lower hall side
  wall(6.87,2.89,.18,.14);wall(6.87,3.985,.18,.05); // entrance 0.95 m
  wall(6.08,.9,.12,1.8);wall(6.47,1.8,.9,.12); // engineering core
  wall(2.6,3.07,5.2,.1); // proposed nursery partition, along dashed plan line
  wall(5.2,4.97,.1,1.8);wall(5.2,3.115,.1,.09);wall(5.2,4.1,.1,.1);
  // Doors leave the entrance and room circulation clear of furniture.
  function door(x,z,w,angle,name){const g=group(name,'Условная дверь; направление открывания уточняется по замерам.');g.position.set(x,0,z);g.rotation.y=angle;box(g,w/2,.025,0,w,2.03,.035,'trim');box(g,w-.08,.95,-.04,.09,.025,.04,'metal');return g;}
  door(5.25,4.05,.88,Math.PI/2,'Дверь детской');
  const entryDoor=door(6.96,3.02,.94,-Math.PI/2,'Входная дверь');
  entryDoor.userData.detail='Входная дверь шириной 94 см показана закрытой; открывание наружу, в сторону подъезда.';
  const bathDoor=door(6.78,2.63,.8,Math.PI/2,'Дверь санузла');
  bathDoor.userData.detail='Дверь санузла шириной 80 см показана закрытой; открывание в прихожую.';
  // Service core and plumbing remain in the original upper-right footprint.
  const core=group('Вентиляция и стояки','Техническая зона по плану. Не переносится.');box(core,6.47,0,.9,.66,2.7,1.68,'tile');
  const kitchen=zones.kitchen=group('Кухня-ниша 4,4 м²','Г-образная кухня в нише 2,43 × 1,80 м; глубина нижних модулей 60 см.');
  const modules=[['Варочная панель',3.955,'Плита 60 см; вытяжка встроена в верхний шкаф.'],['Посудомоечная машина',4.565,'Посудомоечная машина 60 см.'],['Мойка',5.175,'Мойка 60 см; зона коммуникаций сохранена рядом со стояками.']];
  modules.forEach(([name,x,desc],i)=>{const g=group(name,desc,kitchen);box(g,x,.1,.3,.59,.76,.59,'kitchen');box(g,x,.1,.608,.575,.735,.022,'kitchen');box(g,x,.81,.624,.2,.015,.018,'metal');box(g,x,1.49,.185,.59,1.21,.36,'kitchen');box(g,x,1.49,.373,.575,1.19,.018,'kitchen');if(i===1)box(g,x,.77,.626,.54,.055,.022,'ink');});
  box(kitchen,4.865,.86,.315,2.43,.045,.63,'cream');box(kitchen,5.78,.1,.3,.6,.76,.59,'kitchen');
  box(kitchen,4.865,.905,.022,2.43,.57,.03,'cream');
  const hob=group('Варочная панель','Четыре конфорки, ширина 60 см.',kitchen);box(hob,3.955,.909,.31,.52,.012,.47,'ink');[-.135,.135].forEach(x=>[-.12,.12].forEach(z=>cyl(hob,3.955+x,.924,.31+z,.078,.003,'metal',.078,28)));
  box(kitchen,5.175,.909,.3,.43,.018,.39,'metal');box(kitchen,5.175,.929,.3,.34,.007,.3,'ink');
  rod(kitchen,[5.175,.92,.11],[5.175,1.22,.11],.016);rod(kitchen,[5.175,1.22,.11],[5.175,1.22,.28],.016);
  const tower=group('Пенал: духовка и микроволновка','60 × 60 × 270 см. Один пенал содержит духовку и микроволновку.',kitchen);
  box(tower,5.78,.08,.9,.6,2.62,.6,'kitchen');[.1,1.58,2.15].forEach((h,i)=>box(tower,5.468,h,.9,.024,[.55,.5,.52][i],.57,'kitchen'));
  [[.69,.58],[1.31,.34]].forEach(([y,h])=>{box(tower,5.463,y,.9,.033,h,.55,'ink');box(tower,5.442,y+h-.1,.9,.018,.024,.38,'metal');box(tower,5.441,y+.08,.9,.012,h-.23,.4,'metal');});
  const fridge=group('Холодильник','Встроенный холодильник в торце правого ряда: 60 × 60 см.',kitchen);box(fridge,5.78,.08,1.5,.6,2.62,.6,'kitchen');box(fridge,5.469,.12,1.5,.025,.65,.575,'kitchen');box(fridge,5.469,.8,1.5,.025,1.87,.575,'kitchen');box(fridge,5.444,.86,1.24,.018,.7,.018,'metal');
  const living=zones.living=group('Кухня-гостиная','Основная комната 13,2 м² плюс кухня-ниша 4,4 м².');
  const sofa=group('Диван','Диван по фото: 227 × 110 × 95 см, светло-серая обивка, высокая простёганная спинка, широкие подлокотники и две подушки.',living);
  // Sofa local x = length, local z = depth; front faces +z.
  [-.91,.91].forEach(x=>[-.35,.35].forEach(z=>rod(sofa,[x*1.04,.008,z*1.05],[x,.15,z],.027,'darkWood')));
  softBox(sofa,0,.12,.02,2.04,.25,.96,.055);
  softBox(sofa,0,.32,.10,1.91,.19,.80,.055);
  [-1.04,1.04].forEach(x=>softBox(sofa,x,.22,0,.19,.49,1.10,.055));
  [-.49,.49].forEach(x=>softBox(sofa,x,.39,-.42,.97,.56,.26,.075));
  [-.8,-.48,-.16,.16,.48,.8].forEach(x=>{[.52,.74].forEach(y=>softBox(sofa,x,y,-.278,.30,.20,.065,.028));softBox(sofa,x,.48,.10,.305,.035,.70,.014);});
  [-.72,.72].forEach((x,i)=>{const p=softBox(sofa,x,.49,.05,.42,.32,.16,.06,'sofaPillow');p.rotation.z=i?-.4:.4;p.rotation.x=-.22;});
  const loungeRug=group('Ковёр гостиной',null,living);box(loungeRug,1.67,.025,1.64,1.15,.018,1.95,'rug');
  function chair(parent,x,z,angle,child=false){const g=group(child?'Детский стул':'Обеденный стул',null,parent);g.position.set(x,0,z);g.rotation.y=angle;const h=child?.31:.45,w=child?.32:.43;box(g,0,h,0,w,.065,w,'wood');box(g,0,h+.06,-w/2+.015,w,.34,.045,'wood');[-1,1].forEach(a=>[-1,1].forEach(b=>rod(g,[a*w*.35,0,b*w*.35],[a*w*.32,h,b*w*.32],.018,'oak')));return g;}
  const dining=group('Круглый стол и два стула','Стол Ø 90 см вплотную к верхней стене между кухней и диваном; оба стула задвинуты под стол с боков.',living);
  cyl(dining,3.12,.735,1.6,.45,.04,'wood',.45,64);cyl(dining,3.12,.04,1.6,.105,.695,'oak');cyl(dining,3.12,.02,1.6,.27,.04,'oak');
  for(const i of [1,3]){const a=i*Math.PI/2,x=3.12+Math.sin(a)*.45,z=1.6+Math.cos(a)*.45;chair(dining,x,z,a+Math.PI);}
  cyl(dining,3.12,.777,1.6,.075,.13,'cream');rod(dining,[3.12,.91,1.6],[3.13,1.1,1.6],.01,'leaf');ball(dining,3.14,1.08,1.6,.05,.04,.04,'leaf');
  dining.position.set(-.1525,0,-1.15);
  function desk(parent,x,z,w,d,h,name,child=false){const g=group(name,child?'Стол 110 × 55 см возле окна; высота для концепции 52 см, нужен подбор по росту ребёнка и регулируемое основание.':'Компьютерное место 120 × 80 см; сдвинуто влево вплотную к стене у окна без разворота. Телевизор справа.',parent);box(g,x,h,z,w,.04,d,'wood');[-w/2+.05,w/2-.05].forEach(a=>box(g,x+a,0,z,.045,h,d-.06,'cream'));if(!child){box(g,x,h+.15,z+.13,.56,.34,.035,'ink');box(g,x,h+.19,z+.108,.51,.26,.008,'child');box(g,x,h+.04,z+.13,.035,.12,.03,'metal');box(g,x,h+.043,z+.05,.19,.015,.14,'metal');box(g,x,h+.045,z-.13,.32,.015,.11,'ink');box(g,x+.35,.03,z+.02,.16,.4,.33,'ink');}else {box(g,x,h+.045,z,.32,.008,.23,'cream');cyl(g,x,h+.056,z,.035,.07,'terracotta');}return g;}
  desk(living,.6,2.62,1.2,.8,.74,'Рабочее место');
  const pcChair=chair(living,.6,1.8,0);pcChair.name='Компьютерное кресло';
  const tv=group('Телевизор на поворотном кронштейне','ТВ 50″ на перегородке детской. Поворот экрана в сторону дивана уменьшает угол просмотра.',living);
  tv.position.set(2.6,1.38,2.982);tv.rotation.y=.24;box(tv,0,-.32,0,1.11,.64,.045,'ink');box(tv,0,-.29,-.027,1.06,.58,.005,'metal');
  const nursery=zones.nursery=group('Детская 14,6 м²','Две низкие кровати 80 × 180 см без боковых бортиков; кровать возле стола развёрнута ногами к окну.');
  const bed=group('Детская кровать 80 × 180','Матрас 80 × 180 см. Каркас около 188 × 88 см, без боковых бортиков.',nursery);
  box(bed,0,.08,0,1.88,.18,.88,'wood');box(bed,0,.26,0,1.8,.14,.8,'cream');box(bed,.27,.405,0,1.12,.035,.81,'child');
  const headboard=box(bed,-.92,.08,0,.06,.64,.88,'wood');headboard.name='Изголовье';box(bed,-.63,.41,0,.43,.08,.6,'cream');
  bed.position.set(1.16,0,5.29);
  const secondBed=bed.clone(true);secondBed.name='Вторая детская кровать 80 × 180';secondBed.position.set(2.44,0,3.66);secondBed.rotation.y=Math.PI;nursery.add(secondBed);pickable.push(secondBed);
  const childDesk=desk(nursery,.65,3.42,1.1,.55,.52,'Растущий стол',true);
  chair(nursery,.65,4.03,Math.PI,true);
  const closet=group('Шкаф-купе у двери','Шкаф 170 × 60 × 270 см у входа в детскую; фасады обращены в комнату.',nursery);
  box(closet,4.85,.04,5.01,.6,2.66,1.7,'cream');[4.58,5.43].forEach(z=>box(closet,4.539,.08,z,.025,2.58,.83,z<5?'sage':'cream'));[4.92,5.1].forEach(z=>box(closet,4.52,.85,z,.018,.8,.018,'metal'));
  box(nursery,3.6,.027,4.48,1.5,.018,1.55,'rug');
  const toys=group('Детский комод','Комод 125 × 40 см, высота 60 см; переставлен к первой кровати у нижней стены.',nursery);box(toys,2.95,.03,5.62,1.25,.6,.4,'cream');
  for(let i=0;i<3;i++){box(toys,2.53+i*.42,.1,5.41,.36,.23,.018,'child');box(toys,2.53+i*.42,.37,5.41,.36,.21,.018,i%2?'sage':'wood');}
  // The full lower recess becomes a walk-in wardrobe; opening faces the hall.
  const wardrobe=zones.wardrobe=group('Гардеробная на всю нишу','Примерно 1,58 × 1,80 м. Г-образные секции глубиной 55 см; проход внутри около 1,0 м.');
  wall(5.99,4.07,1.58,.08,2.12,.58);
  const wardrobeDoors=group('Зеркальные двери гардеробной','Две раздвижные зеркальные двери. Зеркало перенесено сюда, вход в квартиру свободен.',wardrobe);
  [5.225,6.755].forEach(x=>box(wardrobeDoors,x,.025,4.07,.04,2.1,.1,'metal'));
  [0.025,2.105].forEach(y=>box(wardrobeDoors,5.99,y,4.07,1.57,.025,.1,'metal'));
  const mirrorPanels=[5.63,6.37].map((x,i)=>{const g=group('Зеркальная створка',null,wardrobeDoors);g.position.set(x,0,4.035+i*.05);box(g,0,.05,0,.76,2.04,.025,'metal');box(g,0,.075,-.017,.72,1.99,.006,'mirror');box(g,.32,.8,-.03,.012,.65,.015,'metal');return g;});
  function setWardrobeOpen(open){mirrorPanels[0].position.x=open?6.37:5.63;}
  const storage=group('Г-образное хранение','Глубина секций 55 см. Продольная штанга, полки и нижние ящики.',wardrobe);
  box(storage,5.99,.05,5.585,1.52,.08,.55,'wood');box(storage,6.475,.05,5.025,.55,.08,1.15,'wood');
  [5.25,6.05,6.73].forEach(x=>box(storage,x,.13,5.585,.025,2.57,.55,'wood'));
  [4.47,5.3].forEach(z=>box(storage,6.475,.13,z,.55,2.57,.025,'wood'));
  [.47,.86,2.28,2.66].forEach(y=>{box(storage,5.99,y,5.585,1.52,.025,.55,'wood');box(storage,6.475,y,4.91,.55,.025,.83,'wood');});
  rod(storage,[5.29,2.09,5.58],[6.01,2.09,5.58],.018);
  for(let i=0;i<7;i++){let x=5.34+i*.09;rod(storage,[x,2.08,5.58],[x,1.95,5.58],.007);rod(storage,[x,1.95,5.58],[x,1.87,5.37],.008,'wood');rod(storage,[x,1.95,5.58],[x,1.87,5.79],.008,'wood');box(storage,x,1.17,5.57,.065,.66,.38,i%2?'sage':'linen');}
  [4.64,5.02].forEach(z=>box(storage,6.46,.91,z,.45,.28,.31,'linen'));
  const hall=zones.hall=group('Прихожая','Вход справа свободен от мебели. Дверь санузла выходит в прихожую; зеркало — на дверях гардеробной.');
  const bathroom=zones.bathroom=group('Санузел 4,6 м²','Расстановка санитарных приборов повторяет схему ориентировочно.');
  const tub=group('Ванна','Ориентировочно 170 × 70 см, вдоль правой стены.',bathroom);box(tub,8.03,.02,.9,.7,.57,1.7,'cream');box(tub,8.03,.586,.9,.59,.012,1.53,'glass');
  const wc=group('Унитаз',null,bathroom);box(wc,7.18,.05,.27,.48,.85,.2,'cream');ball(wc,7.18,.36,.58,.24,.17,.31,'cream');
  const basin=group('Умывальник',null,bathroom);box(basin,7.3,.1,2.48,.64,.66,.42,'wood');box(basin,7.3,.76,2.48,.66,.045,.44,'cream');ball(basin,7.3,.82,2.48,.25,.04,.16,'glass');
  const washerGroup=group('Стиральная машина','Стиральная машина 60 × 60 см, люк обращён в центр ванной и свободен от пенала.',bathroom);
  box(washerGroup,8.13,.03,2.05,.6,.85,.6,'cream');const washer=cyl(washerGroup,0,0,0,.18,.025,'metal');washer.rotation.z=Math.PI/2;washer.position.set(7.815,.45,2.05);
  const bathTower=group('Пенал для ванной','Угловой пенал: фасад 35 см, глубина 30 см, высота 270 см. Рядом со стиральной машиной, дверцы обращены в центр ванной.',bathroom);
  box(bathTower,8.285,.04,2.545,.3,2.66,.35,'kitchen');
  box(bathTower,8.122,.08,2.545,.024,2.58,.32,'kitchen');box(bathTower,8.102,1.0,2.67,.015,.65,.018,'metal');
  sofa.position.set(1.15,0,.58);loungeRug.position.set(-.18,0,.12);tv.rotation.y=.16;
  root.updateMatrixWorld(true);
  return {root,walls,zones,pickable,setWardrobeOpen,colors};
}
if(typeof module!=='undefined')module.exports=createApartment;
