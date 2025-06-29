from utils.chat_completion import chat_completion

prompt = """
You are Akatsuki, a character inside the world of a fantasy MMO.

Akatsuki and Shiroe are in the outskirts of akihabara's village scouting the area for an
upcoming raid.

– No hostile entities detected, but caution is warranted.
– Shiroe has been introspective and careful.
– Shiroe initiated a spontaneous game of tag, suggesting a break from tension and a test of reflexes.
– Shiroe tapped his staff and declared, "Tag. I'm it. I'm coming after you, now run." initiating a friendly game.

Akatsuki’s Likely Priorities:
– Remain unseen and track Shiroe from a distance.
- Keep a significant distance away from Shiroe that he can't catch her
– Use terrain advantage and stealth skills to position for a precise tag.
– Monitor the surroundings in case the tension in the area signals a real threat.

Replan conditions:
- Stop if an enemy is spotted    
- Stop if Shiroe catches Akatsuki

Here is your entity:
- Akatsuki: {id: akatsuki, x: 300, y: 500, HP: 1200/1200}    

Here are the surrounding entities:
- Shiroe: {id: shiroe, x: 400, y: 240, HP: 1100/1100}

Translate akatsuki's priorities into an in game goal that can be understood by a GOAP system.

Create world state variables from using the following variables
Only use the following variables:
- 'within_bounds_[entity_id]': boolean (if true you aim to collide with the entity)
- 'within_range_[entity_id]': boolean (if true you aim to be within a small distance with the entity)
- 'within_sight_[entity_id]': boolean (if true you aim to be reasonable distance to maintain sight on the entity)
- 'support_[entity_id]': boolean (if true you aim to cast healing spells on the entity)    
- 'attack_[entity_id]': boolean (if true you aim to attack the entity)    
- 'enemy_detected': boolean (if true you detected an enemy)
- 'terminate_condition': any | all, decide whether to terminate on any or all terminate conditions

if a variable is irrelevant to the goal, you can ignore it

Output a goal with the following format:
goal_name: string    
description: string
desired_world_state: {} object with a set of key value pairs describing desired world state variables (you will actively work on achieving those goals) (win conditions)
terminate_world_state: {} object with a set of key value pairs describing the set of world state variables that cancel this goal - if any (halt and replan if these are true) (fail or stop conditions) 

"""

response = chat_completion([{"role": "user", "content": prompt}])
print(response)

prompt2 = """
You are Akatsuki, a character inside the fantasy world of an MMO.

Akatsuki and Shiroe are in the outskirts of akihabara's village scouting the area for an
upcoming raid.

Akatsuki's Recent Observations:
– No hostile entities detected, but caution is warranted.
– Shiroe initiated a spontaneous game of tag, suggesting a break from tension and a test of reflexes.
– Shiroe tapped his staff and declared, "Tag. I'm it. I'm coming after you, now run." initiating a friendly game.
- Akatsuki moved into the distance getting away from shiroe
- Shiroe used the skill Blink and teleported to Akatsuki

Akatsuki's previous goal:
Remain unseen while tracking Shiroe and prepare to tag him without getting caught.

The goal was terminated on the condition:
within_bounds_shiroe: true  (collision detected between Akatsuki and Shiroe)

Output the context brielfy describing the situation you're in
What is your next action.
What are you going to say

output format:
context: brief description of current context    
action: the next action you're going to take
dialog: what are you planning to say - leave empty if nothing
"""

response2 = chat_completion([{"role": "user", "content": prompt2}])
print(response2)