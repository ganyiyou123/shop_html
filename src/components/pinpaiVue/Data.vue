<template>
    <div align="center">
      <h1>品牌属性的数据</h1>

      <!--条件搜索-->
      <div id="searchDiv">
        <el-form :inline="true" :model="searchForm" class="demo-form-inline">

          <el-form-item label="名称:">
            <el-input v-model="searchForm.name" placeholder="请输入名字"></el-input>
          </el-form-item>

          <el-form-item>
            <el-button type="primary" @click="queryData(1)">查询</el-button>
            <el-button type="success" icon="el-icon-circle-plus-outline"  @click="addFormFlag=true"></el-button>
          </el-form-item>


        </el-form>
      </div>

      <!--查询表格-->
      <div id="dataTable">
        <el-table :data="dataData" border style="width: 100%">

          <el-table-column prop="id" align="center" label="序号" width="80"></el-table-column>

          <el-table-column prop="name" label="名称" width="80"></el-table-column>

          <el-table-column prop="nameCH" label="中文名称" width="80"></el-table-column>

          <el-table-column
            prop="typeId"
            label="商品类型"
            :formatter="changetypeId"
            width="220"
          >
          </el-table-column>



          <el-table-column label="属性类型" width="80">
            <template slot-scope="scope">
              {{ scope.row.type==1?"单选":scope.row.type==2?"多选":scope.row.type==3?"下拉":"文本" }}
            </template>
          </el-table-column>


          <el-table-column label="是否为SKU" width="100">
            <template slot-scope="scope">
              {{ scope.row.isSku==1?"是":"不是" }}
            </template>
          </el-table-column>

          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button size="mini" type="warning"  v-on:click="weihu(scope.row)">属性值维护</el-button>
              <el-button size="mini" icon="el-icon-edit" type="success"  v-on:click="upshow(scope.$index, scope.row)">修改</el-button>
              <el-button size="mini" icon="el-icon-delete" type="danger" v-on:click="del(scope.$index, scope.row)"></el-button>
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

      <!--  新增的弹框   -->
      <el-dialog title="录入信息" :visible.sync="addFormFlag" width="800px">
        <el-form :model="adddataForm" ref="adddataForm" :rules="rule"  label-width="80px">
          <el-form-item label="名称" prop="name">
            <el-input v-model="adddataForm.name" autocomplete="off" ></el-input>
          </el-form-item>

          <el-form-item label="中文名称" prop="nameCH">
            <el-input v-model="adddataForm.nameCH" autocomplete="off" ></el-input>
          </el-form-item>


          <el-form-item label="商品类型" prop="typeId">
            <el-select v-model="adddataForm.typeId" placeholder="请选择">
              <el-option v-for="item in TypeDatas" :key="item.id" :label="item.name" :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="属性类型" prop="type">
            <el-radio-group v-model="adddataForm.type">
              <el-radio label="1">单选</el-radio>
              <el-radio label="2">多选</el-radio>
              <el-radio label="3">下拉</el-radio>
              <el-radio label="4">文本</el-radio>
            </el-radio-group>
          </el-form-item>



          <el-form-item label="是否为SKU" prop="isSku">
            <el-radio-group v-model="adddataForm.isSku">
              <el-radio label="1">是</el-radio>
              <el-radio label="2">不是</el-radio>
            </el-radio-group>
          </el-form-item>

          <el-form-item label="创建人" prop="createPeople">
            <el-input v-model="adddataForm.createPeople" autocomplete="off" ></el-input>
          </el-form-item>


        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="addFormFlag = false">取 消</el-button>
          <el-button type="primary" @click="addForm">确 定</el-button>
        </div>

      </el-dialog>

      <!-- 修改的弹框   -->
      <el-dialog title="修改信息" :visible.sync="upFormFlag" width="800px">

        <el-form :model="updataForm" ref="updataForm" :rules="rule"  label-width="80px">

          <el-form-item label="序号" prop="id">
            <el-input v-model="updataForm.id" autocomplete="off" readonly=""></el-input>
          </el-form-item>

          <el-form-item label="名称" prop="name">
            <el-input v-model="updataForm.name" autocomplete="off" ></el-input>
          </el-form-item>

          <el-form-item label="中文名称" prop="nameCH">
            <el-input v-model="updataForm.nameCH" autocomplete="off" ></el-input>
          </el-form-item>


          <el-form-item label="商品类型" prop="typeId">
            <el-select v-model="updataForm.typeId" placeholder="请选择">
              <el-option
                v-for="item in TypeDatas"
                :key="item.id"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>

          <el-table-column prop="typeId" label="商品类型" :formatter="changetypeId">

          </el-table-column>


          <el-form-item label="属性类型" prop="type">
            <el-radio-group v-model="updataForm.type">
              <el-radio :label="1">单选</el-radio>
              <el-radio :label="2">多选</el-radio>
              <el-radio :label="3">下拉</el-radio>
              <el-radio :label="4">文本</el-radio>
            </el-radio-group>
          </el-form-item>

          <el-form-item label="是否为SKU" prop="isSku">
            <el-radio-group v-model="updataForm.isSku">
              <el-radio :label="1">是</el-radio>
              <el-radio :label="2">不是</el-radio>
            </el-radio-group>
          </el-form-item>


        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="upFormFlag = false">取 消</el-button>
          <el-button type="primary" @click="upForm">确 定</el-button>
        </div>

      </el-dialog>


      <!--属性值的查询-->
      <el-dialog :title="valueTitle" :visible.sync="dataValue" width="800px">
        <el-button size="mini" type="danger" icon="el-icon-circle-plus-outline"  v-on:click="addvalueFlag=true"></el-button>

        <el-table :data="valueData" border style="width: 100%">


          <el-table-column prop="id" align="center" label="序号" width="180"></el-table-column>

          <el-table-column prop="nameCH" label="属性名称" width="180"></el-table-column>

          <el-table-column prop="dataName"  label="属性值名称" width="180"></el-table-column>

          <el-table-column label="操作">
            <template slot-scope="scope">

              <el-button size="mini" type="danger"  v-on:click="upvalue(scope.row)">修改</el-button>
              <el-button size="mini" type="danger" v-on:click="delvalue(scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>

      </el-dialog>

      <!--  新增的弹框   -->
      <el-dialog title="录入信息" :visible.sync="addvalueFlag"  width="800px">
        <el-form :model="addvalueForm" ref="addvalueForm" :rules="rule"   label-width="80px">
          <el-form-item label="名称" prop="name">
            <el-input v-model="addvalueForm.name" autocomplete="off" ></el-input>
          </el-form-item>

          <el-form-item label="中文名称" prop="nameCH">
            <el-input v-model="addvalueForm.nameCH" autocomplete="off" ></el-input>
          </el-form-item>

        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="addvalueFlag = false">取 消</el-button>
          <el-button type="primary" @click="addvalue">确 定</el-button>
        </div>

      </el-dialog>

      <!--  修改的弹框   -->
      <el-dialog :title="upvaluetitle" :visible.sync="upvalueFlag" width="800px">
        <el-form :model="upvalueForm" ref="upvalueForm" :rules="rule"  label-width="80px">

          <el-form-item label="序号" prop="id" >
            <el-input v-model="upvalueForm.id" autocomplete="off"  readonly=""></el-input>
          </el-form-item>

          <el-form-item label="名称" prop="name">
            <el-input v-model="upvalueForm.name" autocomplete="off" ></el-input>
          </el-form-item>

          <el-form-item label="中文名称" prop="nameCH">
            <el-input v-model="upvalueForm.nameCH" autocomplete="off" ></el-input>
          </el-form-item>

        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="upvalueFlag = false">取 消</el-button>
          <el-button type="primary" @click="upvaluedatas">确 定</el-button>
        </div>

      </el-dialog>


    </div>
</template>

<script>
    export default {
        name: "Data",
      data(){
          return{
            row:{},
            /*属性值的修改数据*/
            upvaluetitle:"",
            upvalueFlag:false,
            upvalueForm:{
              id:"",
              name:"",
              nameCH:""
            },
            /*属性值的新增数据*/
            addvalueFlag:false,
            abc:"",
            addvalueForm:{
              name:"",
              nameCH:""
            },
            rule:{ //属性新增验证规则
              name:[
                { required: true, message: '请输入名称', trigger: 'blur' },
                { min: 2, max: 15, message: '长度在 2 到 15 个字符', trigger: 'blur' }
              ],
              nameCH:[
                { required: true, message: '请输入名称', trigger: 'blur' },
                { min: 2, max: 15, message: '长度在 2 到 15 个字符', trigger: 'blur' }
              ]

            },


            /*属性值的查询数据*/
            valueTitle:"",
            dataValue:false,
            valueData:{},

            TypeData:[],
            /* 修改相关的数据  */
            upFormFlag:false,
            updataForm:{
              id:"",
              name:"",
              nameCH:"",
              typeId:"",
              type:"",
              isSku:""
            },

            /* 新增相关的数据  */
            addFormFlag:false,
            TypeDatas:[],
            types:[],
            typename:"",
            adddataForm:{
              name:"",
              nameCH:"",
              typeId:"",
              type:"",
              isSku:"",
              createPeople:""
            },
            rule:{ //属性新增验证规则
              name:[
                { required: true, message: '请输入名称', trigger: 'blur' },
                { min: 2, max: 15, message: '长度在 2 到 15 个字符', trigger: 'blur' }
              ],
              nameCH:[
                { required: true, message: '请输入名称', trigger: 'blur' },
                { min: 2, max: 15, message: '长度在 2 到 15 个字符', trigger: 'blur' }
              ]

            },
            /*查询的数据*/
            dataData:{},
            /* 分页相关的数据  */
            count:0,
            sizes:[2,3,5,10],
            size:2,
            /*条件查询*/
            searchForm:{ name:""}
          }
      },created:function(){
        this.queryData(1);
        this.getTypeData()
      },methods:{
          //属性值删除
        delvalue:function(row){
          this.$ajax.post("http://localhost:8080/api/datavalue/delvalueData?id="+row.id).then(rs=>{

          }).catch(err=>console.log(err))
        },
          //属性值修改
        upvalue:function(row){
          this.upvalueFlag=true;
          this.upvaluetitle=row.name+"的修改信息";
          this.$ajax.get("http://localhost:8080/api/datavalue/upShowvalueData?id="+row.id).then(rs=>{
            var upvdata=rs.data.data;
            console.log(rs);
            this.upvalueForm.id=upvdata.id;
            this.upvalueForm.name=upvdata.name;
            this.upvalueForm.nameCH=upvdata.nameCH;

          }).catch(err=>console.log(err))
        },upvaluedatas:function(){
          //发送请求
          this.$ajax.post("http://localhost:8080/api/datavalue/upvalueData",this.$qs.stringify(this.upvalueForm)).then(res=>{
            this.upvalueFlag=false;

          }).catch(err=>console.log(err));
        },
          //属性值新增
        addvalue:function(){//新增
          this.addvalueForm.dataId=this.abc;
          this.$refs["addvalueForm"].validate(res=>{
            if(res==true){
              this.$ajax.post("http://localhost:8080/api/datavalue/addvalueData",this.$qs.stringify(this.addvalueForm)).then(rs=>{
                //关闭弹框
                this.addvalueFlag=false;
                this.weihu(this.row);
              }).catch(err=>console.log(err))
            }

          })
        },

        weihu:function(row){//属性值查询

          this.abc=row.id;
          this.row=row;
          this.valueTitle=row.nameCH+"的选项信息";
          this.$ajax.get("http://localhost:8080/api/datavalue/getvalueData?dataId="+row.id).then(rs=>{
            for (let i = 0; i <rs.data.data.length ; i++) {
              rs.data.data[i].dataName=row.nameCH;
            }

            this.valueData=rs.data.data;
            console.log(row.id);
            console.log(rs);
          }).catch(err=>console.log(err));

          this.dataValue=true;

        },

        upshow:function(index,row){//修改
          this.upFormFlag=true;
          this.$ajax.get("http://localhost:8080/api/data/upShowData?id="+row.id).then(rs=>{
            var updata=rs.data.data;
            this.updataForm.id=updata.id;
            this.updataForm.name=updata.name;
            this.updataForm.nameCH=updata.nameCH;
            this.updataForm.typeId=updata.typeId;
            this.updataForm.type=updata.type;
            this.updataForm.isSku=updata.isSku;
          }).catch(err=>console.log(err))

     },upForm:function(){
          //发送请求
          this.$ajax.post("http://localhost:8080/api/data/updateDatas",this.$qs.stringify(this.updataForm)).then(res=>{
            this.upFormFlag=false;
            this.queryData(1);
          }).catch(err=>console.log(err));
        },
        //删除
        del:function(index,row){
          this.$ajax.delete("http://localhost:8080/api/data/dleDatasByid?id="+row.id).then(res=>{
            this.queryData(1);
          }).catch(err=>console.log(err))
        },
        addForm:function(){//新增
          this.$refs['adddataForm'].validate(res=>{
            if(res==true){
              this.$ajax.post("http://localhost:8080/api/data/addDatas",this.$qs.stringify(this.adddataForm)).then(rs=>{
                //关闭弹框
                this.addFormFlag=false;
                this.queryData(1);
              }).catch(err=>console.log(err))
            }
          })
        },

          queryData(currPage){//查询
            this.$ajax.get("http://localhost:8080/api/data/queryDatas?size="+this.size+"&currPage="+currPage+"&"+this.$qs.stringify(this.searchForm)).then(rs=>{
              console.log(rs);
              this.dataData=rs.data.data.dlist;
              this.count=rs.data.data.count;
            }).catch(err=>console.log(err))
          },handleCurrentChange:function(currPage){ //跳转页面
          console.log(currPage);
          this.queryData(currPage);
        },handleSizeChange:function(size){ //跳转页面
          this.size=size;
          this.queryData(1);
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
        //查询的类型转换
        changetypeId:function (row, column) {
          for (let i = 0; i <this.types.length ; i++) {
            if (row.typeId==this.types[i].id){
              return this.types[i].name;
            }
          }
          return "未知"
        }

      }
    }
</script>

<style scoped>

</style>
