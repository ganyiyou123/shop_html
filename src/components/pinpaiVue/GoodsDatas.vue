<template>
  <div>
  <h1>商品管理</h1>
  <!--条件搜索-->
  <div id="searchDiv">
    <el-form :inline="true" :model="searchForm" class="demo-form-inline">

      <el-form-item label="名称:">
        <el-input v-model="searchForm.name" placeholder="请输入名字"></el-input>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="queryFoodsdata(1)">查询</el-button>
        <el-button type="success" icon="el-icon-circle-plus-outline"  @click="xinzeng"></el-button>
      </el-form-item>


    </el-form>
  </div>

  <!--查询表格-->
  <div id="dataTable">
    <el-table :data="FoodsData" border style="width: 100%">

      <el-table-column prop="id" align="center" label="序号" width="80"></el-table-column>

      <el-table-column prop="name" label="名称" width="80"></el-table-column>

      <el-table-column prop="title" label="标题" width="80"></el-table-column>

      <el-table-column prop="pinpaiId" label="品牌" :formatter="changePinpaiId" width="80"></el-table-column>

      <el-table-column prop="typeId" label="商品类型" :formatter="changetypeId" width="80"></el-table-column>

      <el-table-column prop="productdecs" label="介绍" width="150"></el-table-column>

      <el-table-column prop="price" label="价格" width="80"></el-table-column>

      <el-table-column prop="stocks" label="库存" width="80"></el-table-column>

      <el-table-column prop="sortNum" label="排序" width="80"></el-table-column>


      <el-table-column prop="imgPath" label="图片" width="80">
        <!-- 按文本处理   :formatter="formatImg"    -->
        <!-- 模板处理  html  -->
        <template slot-scope="scope">
          <img width="50px" :src="scope.row.imgPath">
        </template>
      </el-table-column>


      <el-table-column prop="id" label="商品属性维护" width="180">
        <template slot-scope="scope">
          <el-button type="primary" @click="selectData(scope.row.typeId,scope.row.id)">商品属性维护</el-button>
        </template>
      </el-table-column>

      <el-table-column label="操作"  >
        <template slot-scope="scope">
          <el-button size="mini" icon="el-icon-edit" type="success"  v-on:click="upshow(scope.row)">修改</el-button>
         <el-button size="mini" icon="el-icon-delete" type="danger" v-on:click="del( scope.row)"></el-button>
        </template>
      </el-table-column>
    </el-table>


    <el-pagination
      layout="total,sizes,prev,pager,next,jumper"
      :total="count"
      background
      :page-size="size"
      :page-sizes="sizes"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange">
    </el-pagination>
  </div >

    <!--  修改的弹框   -->
    <el-dialog title="修改商品信息" :visible.sync="upFormFlag" width="800px">

      <el-form :model="uppForm" ref="uppinpaiForm"   label-width="80px">

        <el-form-item label="序号" prop="id">
          <el-input v-model="uppForm.id" autocomplete="off" readonly=""></el-input>
        </el-form-item>

        <el-form-item label="名称" prop="name">
          <el-input v-model="uppForm.name" autocomplete="off" ></el-input>
        </el-form-item>

        <el-form-item label="标题" prop="title">
          <el-input v-model="uppForm.title" autocomplete="off" ></el-input>
        </el-form-item>



        <el-form-item label="品牌" prop="pinpaiId">
          <el-select v-model="uppForm.pinpaiId" placeholder="请选择">
            <el-option v-for="item in pinpaiIdss" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>



        <el-form-item label="介绍" prop="productdecs">
          <el-input v-model="uppForm.productdecs" autocomplete="off" ></el-input>
        </el-form-item>

        <el-form-item label="价格" prop="price">
          <el-input v-model="uppForm.price" autocomplete="off" ></el-input>
        </el-form-item>

        <el-form-item label="库存" prop="stocks">
          <el-input v-model="uppForm.stocks" autocomplete="off" ></el-input>
        </el-form-item>

        <el-form-item label="排序" prop="sortNum">
          <el-input v-model="uppForm.sortNum" autocomplete="off" ></el-input>
        </el-form-item>

        <el-form-item label="图片">
          <img width="50px" :src="uppForm.imgPath"/>
          <el-upload
            class="upload-demo"
            action="http://localhost:8080/api/pinpai/uploadFile"
            :on-success="imgCallBack"
            name="file"
            list-type="picture">
            <el-button size="small" type="primary">点击上传</el-button>
            <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
          </el-upload>
        </el-form-item>


      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="upFormFlag = false">取 消</el-button>
        <el-button type="primary" @click="upForm">确 定</el-button>
      </div>
    </el-dialog>




    <!--商品属性表-->
    <el-dialog title="属性信息" :visible.sync="selectFormFlag" width="800px">

      <el-form :model="foodsForm" label-width="100px" class="demo-ruleForm">

        <el-form-item label="商品分类" prop="typeId">
          <el-select v-model="foodsForm.typeId" placeholder="请选择" @change="getAttrData">
            <el-option v-for="item in TypeDatas" :key="item.id" :label="item.name" :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item v-if="isSKUData.length>0" label="商品规格" prop="name">
          <el-form-item v-for="a in  isSKUData" :key="a.id" :label="a.nameCH">

            <el-checkbox-group v-if="a.type==2" v-model="a.ckValues"  @change="skuChange">
              <el-checkbox v-for="b in a.values" :key="b.id" :label="b.nameCH" name="type"></el-checkbox>
            </el-checkbox-group>

          </el-form-item>
        </el-form-item>

        <!--表格-->
        <el-table v-if="tableShow" :data="tableSkuData" style="width: 100%">
          <!--   动态展示列头  sku属性中文名 -->
          <el-table-column v-for="c in cols" :key="c.id" :label="c.nameCH" :prop="c.name">
          </el-table-column>

          <el-table-column label="库存" width="180">

            <template slot-scope="scope">
              <el-input  v-model="scope.row.stockss"/>
            </template>

          </el-table-column>
          <el-table-column label="价格" width="180">
            <template slot-scope="scope">
              <el-input   v-model="scope.row.pricess"/>
            </template>
          </el-table-column>
        </el-table>


        <el-form-item v-if="noSkuData.length>0" label="商品参数" prop="name">

          <el-form-item v-for="a in  noSkuData" :key="a.id" :label="a.nameCH">

            <template slot-scope="scope">
              <!--  3下拉框    1单选框     2 复选框   4  输入框  -->
              <el-input v-if="a.type==4" v-model="a.ckValues"></el-input>

              <el-select v-if="a.type==3" v-model="a.ckValues"  placeholder="请选择">
                <el-option v-for="b in a.values" :key="b.id"  :label="b.nameCH" :value="b.id"></el-option>
              </el-select>

              <el-radio-group v-if="a.type==1" v-model="a.ckValues">
                <el-radio v-for="b in a.values" :key="b.id" :label="b.nameCH"></el-radio>
              </el-radio-group>

              <el-checkbox-group v-if="a.type==2" v-model="a.ckValues">
                <el-checkbox v-for="b in a.values" :key="b.id" :label="b.nameCH" name="type"></el-checkbox>
              </el-checkbox-group>

            </template>

          </el-form-item>
        </el-form-item>

      </el-form>


      <div slot="footer" class="dialog-footer">
        <el-button @click="selectFormFlag = false">取 消</el-button>
        <!--<el-button type="primary" @click="upDatasForm">确 定</el-button>-->
      </div>

    </el-dialog>

  </div>
</template>

<script>
    export default {
        name: "GoodsDatas",
      data(){
          return{
            /*商品属性数据*/
            selectFormFlag:false,
            uppDatasForm:{
              id:"",
              goodsId:"",
              dataDatas:"",
              storcks:"",
              price:""
            },

            TypeDatas:[],
            types:[],
            typename:"",
            foodsForm:{},

            noSkuData:[],   //非sku的属性数据
            isSKUData:[], //sku属性数据

            skuCK:[], //确定sku复选框绑定的变量名
            cols:[],//skutable的动态表头
            tableSkuData:[],//skutable的动态表头对应的表格数据
            tableShow:false,

            stockss:"",
            pricess:"",

            /* 修改相关的数据  */
            pinpaiIdss:[],
            upFormFlag:false,
            uppForm:{
              id:"",
              name:"",
              title:"",
              pinpaiId:"",
              productdecs:"",
              price:"",
              stocks:"",
              imgPath:"",
              sortNum:""

            },
            FoodsData:{},
            /*查询的数据*/
            count:0,
            sizes:[2,3,5,10],
            size:2,
            searchForm:{
              name:"",
            },
            //品牌查询数据3
            pinpaiss:[],




          }

      },
      //初始化
      created:function(){
        this.queryFoodsdata(1);
        this.getTypeData();
        this.queryDatas();
      },
      methods:{
          //商品属性维护
        selectData:function(typeId,id){
          this.selectFormFlag=true;
          //回显分类id
          this.foodsForm.typeId=typeId;
          //回显属性数据
          this.getAttrData(typeId,id);
          //分类数据
          this.getTypeData();
          //回显table
          this.skuChange();
        },
        /* 笛卡尔积    */
        calcDescartes:function(array) {
          if (array.length < 2) return array[0] || [];
          return [].reduce.call(array, function (col, set) {
            var res = [];
            col.forEach(function (c) {
              set.forEach(function (s) {
                var t = [].concat(Array.isArray(c) ? c : [c]);
                t.push(s);
                res.push(t);
              })
            });
            return res;
          });
        },

        //监听sku属性 改变事件
        skuChange:function(){

          //判断是否要生产成笛卡尔积
          this.cols=[];
          this.tableSkuData=[];

          let array=[];
          let flag=true;
          for (let i = 0; i <this.isSKUData.length; i++) {
            this.cols.push(this.isSKUData[i]);
            array.push(this.isSKUData[i].ckValues);
            if(this.isSKUData[i].ckValues.length==0){
              flag=false;
              break;
            }

          }if(flag==true){

            let dkej= this.calcDescartes(array);
            for (let i = 0; i <dkej.length ; i++) {
              let hang=dkej[i];
              var jsonss={};
              for (let j = 0; j <hang.length ; j++) {
                let key=this.cols[j].name;
                jsonss[key]=hang[j];
              }
              this.tableSkuData.push(jsonss);
            }
            this.tableShow=flag;
          }

        },
        /*   根据typeid 查询属性数据和sku数据  */
        getAttrData:function(typeId,id){
          this.$ajax.get("http://localhost:8080/api/goods/upShowgoodsDatas?goodsId="+id).then(rs=>{

              let selectdatas=rs.data.data;
              this.isSKUData=[];
              this.noSkuData=[];
          this.$ajax.get("http://localhost:8080/api/data/queryDatasBytypeId?typeId="+typeId).then(rs=>{
            //获取所有属性
            let dataDatas=rs.data.data;

            //判断分类是否有数据
            if(dataDatas.length>0){
              //初始化 noSkuData:[],  isSKUData:[]
              for (let i = 0; i <dataDatas.length ; i++) {
                //判断是否为sku
                if(dataDatas[i].isSku==2){

                  if(dataDatas[i].type!=4){

                    //回显
                    if(dataDatas[i].type==3){
                      if(this.getValeu(dataDatas[i].name,selectdatas)==""){
                        dataDatas[i].ckValues=[];
                      }else{
                        dataDatas[i].ckValues=this.getValeu(dataDatas[i].name,selectdatas);
                      }
                    }else{
                      dataDatas[i].ckValues=this.getValeu(dataDatas[i].name,selectdatas);
                    }


                    this.$ajax.get("http://localhost:8080/api/datavalue/getvalueData?dataId="+dataDatas[i].id).then(rs=>{
                      dataDatas[i].values=rs.data.data;
                      this.noSkuData.push(dataDatas[i]);
                    })
                  }else{
                    dataDatas[i].ckValues=this.getValeu(dataDatas[i].name,selectdatas);
                    this.noSkuData.push(dataDatas[i]);

                  }

                }else{
                  if(dataDatas[i].type!=4){

                    //回显
                    if(dataDatas[i].type==3){
                      if(this.getValeu(dataDatas[i].name,selectdatas)==""){
                        dataDatas[i].ckValues=[];
                      }else{
                        dataDatas[i].ckValues=this.getValeu(dataDatas[i].name,selectdatas);
                      }
                    }else{
                      dataDatas[i].ckValues=this.getValeu(dataDatas[i].name,selectdatas);
                    }

                    this.$ajax.get("http://localhost:8080/api/datavalue/getvalueData?dataId="+dataDatas[i].id).then(rs=>{
                      dataDatas[i].values=rs.data.data;
                      dataDatas[i].ckValues=this.getValeu(dataDatas[i].name,selectdatas);
                      this.isSKUData.push(dataDatas[i]);

                    })
                  }else{
                    dataDatas[i].ckValues=[];
                    this.isSKUData.push(dataDatas[i]);
                  }

                }
              }

            }else{
              this.isSKUData=[];
              this.noSkuData=[];
            }

          })
          })
        },


        getValeu:function(key,data){
          /*console.log("--------");
          console.log(key);
          console.log(data);
          console.log("--------");*/
          let  arrValue=[];
          debugger;
          //遍历当前商品对应的所有的属性
          for (let i = 0; i <data.length ; i++) {
            //得到当前属性数据的一个 将字符串转为json
            let  objData=JSON.parse(data[i].dataDatas);
            console.log(objData);
            // 判断当前的属性数据 是否为想要的属性值
            if(objData[key]!=null){ //找到对应的值了
              //判断当前属性是否为sku
              if(data[i].storcks!=null){
                if(arrValue.indexOf(objData[key])==-1){
                  arrValue.push(objData[key]);
                }

              }else{
                return objData[key];
              }

            }
          }
          return arrValue;
        },


          //--------------------------------------------------------------------------------------------------
          //删除
        del:function(row){
          this.$ajax.post("http://localhost:8080/api/goods/deleteGoods?id="+row.id).then(rs=>{
            this.$message.success("删除成功")
            this.queryFoodsdata(1);
          }).catch(err=>console.log(err))
        },

          //修改
        upForm:function(){
          this.$ajax.post("http://localhost:8080/api/goods/updateGoods",this.$qs.stringify(this.uppForm)).then(rs=>{
            this.upFormFlag=false;
            this.$message.success("修改成功")
            this.queryFoodsdata(1);
          }).catch(err=>console.log(err))
    },
          //修改回显
        upshow:function(row){
          this.upFormFlag=true;
          this.$ajax.get("http://localhost:8080/api/goods/updateShowGoods?id="+row.id).then(rs=>{
            var updata=rs.data.data;
            this.uppForm=updata;
            this.uppForm.id=updata.id;
            this.uppForm.name=updata.name;
            this.uppForm.title=updata.title;
            this.uppForm.pinpaiId=updata.pinpaiId;
            this.uppForm.productdecs=updata.productdecs;
            this.uppForm.price=updata.price;
            this.uppForm.stocks=updata.stocks;
            this.uppForm.imgPath=updata.imgPath;
            this.uppForm.sortNum=updata.sortNum;

          }).catch(err=>console.log(err))
        },
          //新增跳转页面
          xinzeng:function(){
            this.$router.push("/Goods");
          },
          //查询品牌数据
        queryDatas(){
          this.$ajax.get("http://localhost:8080/api/pinpai/getDatas").then(rs=>{

            this.pinpaiss=rs.data.data;
            //修改的品牌回显
            for (let i = 0; i <this.pinpaiss.length ; i++) {
              let node=this.pinpaiss[i];
              this.pinpaiIdss.push(this.pinpaiss[i]);
            }
          }).catch(err=>console.log(err))
        },
        changePinpaiId:function(row,column){
          for (let i = 0; i <this.pinpaiss.length ; i++) {
            if(row.pinpaiId==this.pinpaiss[i].id){
              return this.pinpaiss[i].name;
            }
          }
          return "未知";
        },

          //查询商品类型
        getTypeData() {
          this.$ajax.get("http://localhost:8080/api/type/getData").then(res=>{
            this.types=res.data.data;
          }).catch(err=>console.log(err))
        },
          changetypeId:function(row, column){
            for (let i = 0; i <this.types.length ; i++) {
              if(row.typeId==this.types[i].id){
                  return this.types[i].name;
              }
            }
            return "未知"
          },
        //商品数据查询
          queryFoodsdata(currPage){
            this.$ajax.get("http://localhost:8080/api/goods/getGoods?size="+this.size+"&currPage="+currPage+"&"+this.$qs.stringify(this.searchForm)).then(rs=>{
              this.count=rs.data.data.count;
              this.FoodsData=rs.data.data.glist;
            }).catch(err=>console.log(err))
          },
        handleCurrentChange:function(currPage){ //跳转页面

        this.queryFoodsdata(currPage);
          },
        handleSizeChange:function(size){ //跳转页面
        this.size=size;
        this.queryFoodsdata(1);
          },

        //图片上传
        imgCallBack:function(response, file, fileList){ //图片上传的回调函数

          // 赋值
          this.uppForm.imgPath=response.data;

        },

        //类型数据查询
        getTypeData:function () {
          this.$ajax.get("http://localhost:8080/api/type/getData").then(res=>{
            //console.log(res)
            this.types=res.data.data;

            this.getTypeDatas();

            //遍历所有的子节点
            for (let i = 0; i <this.TypeDatas.length ; i++) {
              this.typename="";//全局 零时存值
              this.gettypeName(this.TypeDatas[i]);
              this.TypeDatas[i].name=this.typename.split("/").reverse().join("/").substring(0,this.typename.length-1);
            }

          }).catch(err=>console.log(err))
        },
        //获取节点的name
        gettypeName:function(node){
          if(node.pid!=0){
            this.typename+="/"+node.name;
            //获取上级节点
            for (let i = 0; i <this.types.length ; i++) {
              if(node.pid==this.types[i].id){
                this.gettypeName(this.types[i]);
                break;
              }
            }
          }else{
            this.typename+="/"+node.name;
          }
        },
        //获取所有节点数据
        getTypeDatas(){
          for (let i = 0; i <this.types.length ; i++) {
            let node=this.types[i];//{"id":7,name:"分类/电子产品/手机"},
            this.isSon(node)
          }
        },
        //判断是否为子节点
        isSon:function(node){
          let rs=true;//表实这个节点为子节点
          for (let i = 0; i <this.types.length ; i++) {
            if(node.id==this.types[i].pid){//1  0
              rs=false;
              break;
            }
          }
          if(rs==true){
            this.TypeDatas.push(node);
          }
        },

      }
    }
</script>

<style scoped>

</style>
