import mongoose from 'mongoose';
import {Router} from 'express';
import FoodTruck from '../model/foodtruck';

export default({config, db}) => {
  let api = Router();

  // CREATE
  // add new foodtruck '/vi1/foodtruck/add'
  api.post('/add', (req, res) => {
    let newFoodTruck = new FoodTruck();
    newFoodTruck.name = req.body.name;

    newFoodTruck.save(err => {
      if (err) {
        res.send(err);
      }
      res.json({message: 'FoodTruck saved successfully'});
    });
  });

  // READ
  // retrieve all foodtrucks '/vi1/foodtruck'
  api.get('/', (req, res) => {
    FoodTruck.find({}, (err, foodtrucks) => {
      if(err) {
        res.send(err);
      }
      res.json(foodtrucks);
    });
  });

  // retrieve 1 foodtruck '/vi1/foodtruck/:id'
  api.get('/:id', (req, res) => {
    FoodTruck.findById(req.params.id, (err, foodtruck) => {
      if(err) {
        res.send(err);
      }
      res.json(foodtruck);
    });
  });

  // UPDATE
  // update existing foodtruck '/vi1/foodtruck/:id'
  api.put('/:id', (req, res) => {
    FoodTruck.findById(req.params.id, (err,foodtruck) => {
      if (err) {
        res.send(err);
      }
      foodtruck.name = req.body.name;
      foodtruck.save(err => {
        if(err) {
          res.send(err);
        }
        res.json({message: "FoodTruck info updated"});
      });
    });
  });

  // DELETE
  // delete foodtruck '/v1/foodtruck/:id'
  api.delete('/:id', (req, res) => {
    FoodTruck.remove({
      _id: req.params.id
    }, (err, foodtruck) => {
      if(err) {
        res.send(err);
      }
      res.json({message: "FoodTruck Successfully Removed!"});
    });
  });


  return api;
}
