const os = require('os');
const formData = require('form-data');
const fs = require('fs');

module.exports = {
    beforeRequest: function(requestParams, context, event, done){
        console.log("before request middleware executed");
        console.log("cpu load : ", os.loadavg()[0])
        //capturing metrics before the request
        context.vars.requestMetrics = {
            startTime: process.hrtime(),
            startCpu: process.cpuUsage(),
            startMemory: process.memoryUsage(),
            systemLoad: os.loadavg()[0]
        }

        return done();
    },

    afterResponse: function(requestParams, response, context, ee, done){
        console.log("after response middleware executed");
         console.log("cpu load : ", os.loadavg()[0])
        const startMetrics = context.vars.requestMetrics;
        //skip if no start metrics captured
        if(!startMetrics)
            return done();
        
        //calculate request duration
        const [seconds, nanoseconds] = process.hrtime(startMetrics.startTime);
        const requestDuration = seconds * 1000 + nanoseconds / 1e6;

        //calculate the cpu usage during request
        const cpuUsageEnd = process.cpuUsage(startMetrics.startCpu);
        const cpuTimeMs = (cpuUsageEnd.user + cpuUsageEnd.system) / 1000;

        //current memeory usage
        const currentMemory = process.memoryUsage();

        const memoryData = {
            rss: (currentMemory.rss - startMetrics.startMemory.rss) / 1024 / 1024, //MB  
            heapUsed: (currentMemory.heapUsed - startMetrics.startMemory.heapUsed) / 1024 / 1024,  //MB //it 
        }

        //get current system load
        const currentLoad = os.loadavg()[0];
        const loadDelta = currentLoad - startMetrics.systemLoad;
        
        // emit request-specific metrics
        ee.emit('histogram', 'request.duration_ms', requestDuration);
        ee.emit('histogram', 'request.cpu_time_ms', cpuTimeMs);
        ee.emit('histogram', 'request.memory_rss_delta_mb', memoryData.rss);
        ee.emit('histogram', 'request.memory_heap_delta_mb', memoryData.heapUsed);
        ee.emit('histogram', 'request.cpu_load_delta', loadDelta);

        //request completed
        ee.emit('counter', 'request.completed', 1);

        return done();

    },

    fileUpload: function(requestParams, context, ee, done){
        const form = new formData();
        let fileToRead = "./fileUploadTesting/db_concepts.pdf";
        form.append('file', fs.createReadStream(fileToRead));
        form.append('isPrivate',"true");
        requestParams.headers = {
            ...requestParams.headers,
            ...form.getHeaders()
        }
        requestParams.body = form;
        return done();
    }
}