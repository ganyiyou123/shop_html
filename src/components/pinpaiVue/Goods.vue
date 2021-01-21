<template >
  <div  >


    <el-steps  style="margin-left: 120px"   :space="200" :active="active" finish-status="success">
      <el-step title="基本信息"></el-step>
      <el-step title="商品属性"></el-step>
      <el-step title="商品图片"></el-step>
    </el-steps>


    <!--第一-->
    <div v-if="active==0" >
    <el-form :model="addFoodsForm" ref="addFoodsForm" label-width="120px"   style="width: 600px" size="small">



      <el-form-item label="商品名称" prop="name">
        <el-input v-model="addFoodsForm.name" autocomplete="off" ></el-input>
      </el-form-item>

      <el-form-item label="商品标题" prop="title">
        <el-input v-model="addFoodsForm.title" autocomplete="off" ></el-input>
      </el-form-item>



      <el-form-item label="商品品牌" prop="pinpaiId">
        <el-select v-model="addFoodsForm.pinpaiId" placeholder="请选择">
          <el-option v-for="item in foodsDatas" :key="item.id" :label="item.name" :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="商品介绍" prop="productdecs">
        <el-input :autoSize="true" type="textarea" placeholder="请输入内容" v-model="addFoodsForm.productdecs" autocomplete="off" ></el-input>
      </el-form-item>

      <el-form-item label="商品价格" prop="price">
        <el-input v-model="addFoodsForm.price" autocomplete="off" ></el-input>
      </el-form-item>

      <el-form-item label="图片">
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

      <el-form-item label="商品库存" prop="stocks">
        <el-input v-model="addFoodsForm.stocks" autocomplete="off" ></el-input>
      </el-form-item>

      <el-form-item label="商品排序" prop="sortNum">
        <el-input v-model="addFoodsForm.sortNum" autocomplete="off" ></el-input>
      </el-form-item>

      <el-form-item style="text-align: center">
        <el-button type="primary" size="medium" @click="next">下一步</el-button>
      </el-form-item>

    </el-form>
    </div>

    <!--第二-->
    <div v-if="active==1">
      <el-form :model="foodsForm" label-width="100px" class="demo-ruleForm">

        <el-form-item label="商品分类" prop="typeId">
          <el-select v-model="foodsForm.typeId" placeholder="请选择" @change="getAttrData">
            <el-option v-for="item in TypeDatas" :key="item.id" :label="item.name" :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item v-if="isSKUData.length>0" label="商品规格" prop="name">
          <el-form-item v-for="a in  isSKUData" :key="a.id" :label="a.nameCH">

            <!--  3下拉框    1单选框     2 复选框   4  输入框  -->
            <!--<el-input v-if="a.type==4"></el-input>

            <el-select v-if="a.type==3" v-model="bbb"  placeholder="请选择">
              <el-option v-for="b in a.values" :key="b.id"  :label="b.nameCH" :value="b.id"></el-option>
            </el-select>

            <el-radio-group v-if="a.type==1"  v-model="aaa">
              <el-radio v-for="b in a.values" :key="b.id" :label="b.nameCH"></el-radio>
            </el-radio-group>-->

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


      <el-button type="primary" size="medium" @click="active--">上一步</el-button>
      <el-button type="primary" size="medium" @click="next">下一步</el-button>
      <el-button type="primary" @click="addProduct">添加</el-button>
    </div>


    <!--第三-->
    <div v-if="active==2">
      <el-button type="primary" @click="active--">上一步</el-button>
      222
    </div>



  </div>
</template>

<script>
    export default {
        name: "Goods",
      data(){
          return{
            active: 0,
            ss:[],
            aaa:[],
            bbb:"",
            /*新增相关的数据*/
            foodsData:[],
            foodsDatas:[],
            addFoodsForm:{
              name:"",
              title:"",
              pinpaiId:"",
              productdecs:"",
              price:"",
              stocks:"",
              sortNum:"",
              imgPath:""
            },
            /*第二部数据*/
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
            pricess:""


          }
      },
      created:function(){
          this.queryDatas();
          this.getTypeData();
          this.getAttrData()
    },
      methods:{
        //添加商品
        addProduct:function(){
          this.addFoodsForm.typeId=this.foodsForm.typeId;
         /* console.log(this.addFoodsForm);*/
          //sku数据
          console.log(this.tableSkuData);
          //非sku数据
          console.log(this.noSkuData);
          //声明后台接参的
          let array=[];
          for (let i = 0; i <this.noSkuData.length ; i++) {
            let noSku={};
            noSku[this.noSkuData[i].name]=this.noSkuData[i].ckValues;
            array.push(noSku);
          }

          this.addFoodsForm.nosku=JSON.stringify(array);
          this.addFoodsForm.sku=JSON.stringify(this.tableSkuData)//传参是string   怎么将js json 转为字符串
          console.log(this.$qs.stringify(this.addFoodsForm));
          //发起请求 保存数据
          this.$ajax.post("http://localhost:8080/api/goods/addGoods",this.$qs.stringify(this.addFoodsForm)).then(rs=>{
                this.$message.success("新增成功")
          }).catch(err=>console.log(err))

        },

        //图片上传
        imgCallBack:function(response, file, fileList){ //图片上传的回调函数
          console.log(response);
          // 赋值
          this.addFoodsForm.imgPath=response.data;
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
          console.log(this.isSKUData);
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
            alert("可以生成笛卡尔积");
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
        /*  步骤条  下一页  */
        next() {
          if (this.active++ > 2) this.active = 0;
        },
        /*   根据typeid 查询属性数据和sku数据  */
        getAttrData:function(typeId){
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
                    this.$ajax.get("http://localhost:8080/api/datavalue/getvalueData?dataId="+dataDatas[i].id).then(rs=>{
                      dataDatas[i].values=rs.data.data;
                      this.noSkuData.push(dataDatas[i]);
                    })
                  }else{
                    this.noSkuData.push(dataDatas[i]);
                  }

                }else{
                  if(dataDatas[i].type!=4){
                    this.$ajax.get("http://localhost:8080/api/datavalue/getvalueData?dataId="+dataDatas[i].id).then(rs=>{
                      dataDatas[i].values=rs.data.data;
                      dataDatas[i].ckValues=[];
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
        },


        //获取所有品牌数据
        queryDatas(){
          this.$ajax.get("http://localhost:8080/api/pinpai/getDatas").then(rs=>{

            this.foodsData=rs.data.data;
            this.getchildennode();
          }).catch(err=>console.log(err))
        },
        //获取所有节点
        getchildennode(){
          for (let i = 0; i <this.foodsData.length ; i++) {

            let node=this.foodsData[i];

            this.foodsDatas.push(this.foodsData[i]);

          }
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
