import {observable, action} from "mobx";
import Client from '../../../common/lead-api'
class PreviewTaskStore {
    @observable InfoList = [];
    @observable total = 1;
    @observable successNum = 0;
    @observable errorNum = 1;
    @action
    getTaskInfoList(id,pageNo,pageSize) {
        Client.getNullArgument('strategy/getTaskInfoList?taskId='+id+'&pageNo='+pageNo+'&pageSize='+pageSize)
            .then(res=>{
                this.InfoList=res.list;
                this.total=res.allCount;
                this.successNum=res.successCount;
                this.errorNum=res.failCount;
            })
    }
}
const previewTaskStore = new PreviewTaskStore();
export default previewTaskStore
