world_state_variables = """
- 'within_bounds_[entity_id]': boolean (if true you aim to collide with the entity)
- 'within_range_[entity_id]': boolean (if true you aim to be within a small distance with the entity)
- 'within_sight_[entity_id]': boolean (if true you aim to be reasonable distance to maintain sight on the entity)
- 'support_[entity_id]': boolean (if true you aim to cast healing spells on the entity)    
- 'attack_[entity_id]': boolean (if true you aim to attack the entity)    
- 'enemy_detected': boolean (if true you detected an enemy)
- 'terminate_condition': any | all, decide whether to terminate on any or all terminate conditions

If a variable is irrelevant to the goal, you can ignore it.
If you need to take action to set a variable into false, set it's world_state_variable to false
(for example: within_bounds_{entity_id} = flase, within_range_{entity_id} = false, runs away from the entity)
"""