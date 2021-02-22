<template>
    <div>
      <h1>商品新增</h1>

      <el-steps :active="active" finish-status="success">
        <el-step title="基本信息"></el-step>
        <el-step title="商品属性"></el-step>
      </el-steps>
      <br/>
      <br/>
      <br/>

      <!--第一-->
      <div v-if="active==0" >
        <el-form :model="addFoodsForm" ref="addFoodsForm" label-width="120px" :rules="rule"    style="width: 600px" size="small">



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
        <el-button type="primary" @click="addProduct">添加</el-button>
      </div>




    </div>
</template>

<script>
    export default {
        name: "Goods2",
      data(){
          return{
            active: 0,
            /*新增相关的数据*/
            foodsData:[],
            foodsDatas:[],
            addFoodsForm:{
              typeId:"",
              name:"",
              title:"",
              pinpaiId:"",
              productdecs:"",
              price:"",
              stocks:"",
              sortNum:"",
              imgPath:""
            },

            TypeDatas:[],
            types:[],
            typename:"",
            foodsForm:{
              typeId:"",
            },

            noSkuData:[],   //非sku的属性数据
            isSKUData:[], //sku属性数据

            skuCK:[], //确定sku复选框绑定的变量名
            cols:[],//skutable的动态表头
            tableSkuData:[],//skutable的动态表头对应的表格数据
            tableShow:false,

            stockss:"",
            pricess:"",


          }
      },
      //初始化
      created:function(){
          this.queryDatas();
          this. getAttrData();
          this.getTypeData();

      },
      methods:{

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
          //强制刷新组件
          this.$forceUpdate();
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

        /*   根据typeid 查询属性数据和sku数据  */
        getAttrData:function(){
          //获取此分类下的sku数据和attr 数据
          this.$ajax.get("http://localhost:8080/api/data/queryDatavalueByTypeIId?typeId="+this.foodsForm.typeId).then(res=>{

            //得到所有的sku数据
            this.isSKUData=res.data.data.skuData;
            for (let i = 0; i <this.isSKUData.length ; i++) {
              this.isSKUData[i].ckValues=[];
            }
            //处理非sku数据
            this.noSkuData=res.data.data.noskuData;
            for (let i = 0; i <this.noSkuData.length ; i++) {
              if(this.noSkuData[i].type==3){
                this.noSkuData[i].ckValues=[];
              }
            }
          })
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
