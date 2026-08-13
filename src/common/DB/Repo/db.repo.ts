import type { CreateOptions, Model, ObjectId, ProjectionType, QueryFilter, QueryOptions, UpdateQuery }from 'mongoose';
import * as mongodb from "mongodb";
abstract class DBRepo <T>{
    constructor(protected  Model : Model<T>){}
    public async create({data , options}:{data:any ,options?:CreateOptions}){
        return await this.Model.create(data , options);
    }

    public async findOne({filter , projection , options}:{

        filter?: QueryFilter<T>,
        projection?: ProjectionType<T>,
        options?: QueryOptions<T>
        
    }){
        return await this.Model.findOne(filter , projection , options);
    }
    public async findOneAndUpdate({filter , update , options}:{

        filter?: QueryFilter<T>,
        update?: UpdateQuery<T>,
        options?: QueryOptions<T>
        
    }){
        return await this.Model.findOneAndUpdate(filter , update , options);
    }
    public async find({filter , projection , options}:{

        filter?: QueryFilter<T>,
        projection?: ProjectionType<T>,
        options?: QueryOptions<T>
        
    }){
        return await this.Model.find(filter , projection , options);
    }

    public async findById({id , projection , options}:{
        id?: ObjectId | string,
      projection?: ProjectionType<T>,
      options?: QueryOptions<T>

    }){
        return await this.Model.findById(id , projection , options)
    }
     async  updateOne({filter , data , options}:
        {
              filter: QueryFilter<T>,
              data: UpdateQuery<T>,
              options?: (mongodb.UpdateOptions)}
     ){
    const result = await this.Model.updateOne(filter , data , options);
    return result
}
async deleteOne({
    filter,
    options
}: {
    filter: QueryFilter<T>,
    options?:mongodb.DeleteOptions
}) {
    const result = await this.Model.deleteOne(filter, options);
    return result;
}
    async paginate({
        filter,
        projection,
        options,
        page = 1,
        size = 3
    }:{
        filter?:QueryFilter<T>,
        projection?:ProjectionType<T>,
        options?:QueryOptions<T>,
        page:number,
        size:number
    }){
        const skip = (page - 1) * size
        const docs = await this.Model.find(filter,projection,options).skip(skip).limit(size);
        const countDocs = await this.Model.countDocuments(filter);
        return {
            docs,
            page,
            totalDocs:countDocs,
            totalPages:Math.ceil(countDocs / size)
        }

    }
}



export default DBRepo