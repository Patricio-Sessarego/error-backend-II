import { connect } from 'mongoose'

export const connectDB = async () => {
    console.log('BASE DE DATOS CONECTADA')
    return await connect('mongodb+srv://Patricio-Sessarego:Patricio2005@clustercoderhouse.jdm36.mongodb.net/BackendII?retryWrites=true&w=majority&appName=ClusterCoderHouse')
}