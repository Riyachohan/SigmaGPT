import 'dotenv/config';

const getGeminiResponse = async(message) => {
    const options = {
        method:"POST",
        headers:{
            "content-type":"application/json",
            "x-goog-api-key": process.env.GEMINI_API_KEY
        },

        body:JSON.stringify({
            "model":"gemini-3.6-flash",
            "input":[{
                type:"user_input",
                // "content":"Hello! How are you?"
                content: message
            }]
        })
    }


    try{

       const response = await fetch("https://generativelanguage.googleapis.com/v1beta/interactions",options);
       const data = await response.json();
    //    console.log(data.steps[1].content[0].text);
    //    return data.steps[1].content[0].text;
       
    //    console.log(JSON.stringify(data, null, 2));
    //    return data;


        // 1. Check if Gemini returned an error
        if (!response.ok) {

            console.log("Gemini API Error:", data.error?.message);

            return `Sorry, Gemini API error: ${
                data.error?.message || "Unknown error"
            }`;
        }

        // 2. Check if steps exists
        if (!data.steps) {
            return "Sorry, Gemini did not return a response.";
        }

        // 3. Get the response text
        return data.steps[1]?.content?.[0]?.text
            || "Sorry, Gemini returned an empty response.";


    }
    catch (error) {
        console.log(error);
    }
}

export default getGeminiResponse;



