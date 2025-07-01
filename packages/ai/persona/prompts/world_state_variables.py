world_state_variables = """
- 'within_bounds_[entity_id]': boolean (if true you aim to collide with the entity, false to move away after colliding with this entity)
- 'within_range_[entity_id]': boolean (if true you aim to be within a small distance with the entity, false to move away from the entity)
- 'within_sight_[entity_id]': boolean (if true you aim to be reasonable distance to maintain sight on the entity, false to stay at a far distance from the entity)
- 'support_[entity_id]': boolean (if true you aim to cast healing spells on the entity)    
- 'attack_[entity_id]': boolean (if true you aim to attack the entity)    

If a variable is irrelevant to the goal, you can ignore it.
If you need to take action to set a variable into false, set it's world_state_variable to false
(for example: within_bounds_{entity_id} = flase, within_range_{entity_id} = false, runs away from the entity)
"""