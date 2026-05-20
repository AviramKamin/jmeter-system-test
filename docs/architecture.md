# System Architecture


JMeter
   |
   v
Backend API Service
   |
   +--> Application Logic


## Current Version

The current implementation focuses on validating backend behavior under blocking request conditions.

Future versions may introduce:

- database dependency simulation
- retry behavior
- queue processing
- worker degradation scenarios

while maintaining fixed project scope boundaries.