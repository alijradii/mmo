goap_output_format = """
name: string    
description: string
desired_world_state: {} object with a set of key value pairs describing desired world state variables (you will actively work on achieving those goals) (win conditions)
terminate_world_state: {} object with a set of key value pairs describing the set of world state variables that cancel this goal - if any (halt and replan if these are true) (fail or stop conditions) 
dialogue: a string that describes what you'll say next, if nothing then leave empty

Respond with a valid json object with the following format, don't add any explanation, just return the object.
{
    "name": string,                       
    "description": string,                
    "desired_world_state": { [key]: bool }
    "terminate_world_state": { [key]: bool }
    "dialogue": string
}
"""