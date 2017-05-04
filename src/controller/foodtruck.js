import mongoose from 'mongoose';
import {Router} from 'express';
import FoodTruck from '../model/foodtruck';
import Review from '../model/review';

export default({config, db}) => {
  let api = Router();

  // CREATE
  // add new foodtruck '/vi1/foodtruck/add'
  api.post('/add', (req, res) => {
    let newFoodTruck = new FoodTruck();
    newFoodTruck.name = req.body.name;
    newFoodTruck.foodtype = req.body.foodtype;
    newFoodTruck.avgcost = req.body.avgcost;
    newFoodTruck.geometry.coordinates = req.body.geometry.coordinates;

    newFoodTruck.save(err => {
      if (err) {
        res.send(err);
      }
      res.json({message: 'FoodTruck saved successfully'});
    });
  });

  // add review for a specific foodtruck id
  // '/v1/foodtruck/reviews/add/:id'
  api.post('/reviews/add/:id', (req, res) => {
    FoodTruck.findById(req.params.id, (err, foodtruck) => {
      if(err) {
        res.send(err);
      }
      let newReview = new Review();

      newReview.title = req.body.title;
      newReview.text = req.body.text;
      newReview.foodtruck = foodtruck._id;
      newReview.save((err, review) => {
        if(err) {
          res.send(err);
        }
        // push newReview object to "reviews" array reference to model
        foodtruck.reviews.push(newReview);
        // and then save it
        foodtruck.save(err => {
          if(err) {
            res.send(err);
          }
          res.json({message: 'Food truck review saved!'});
        });
      });
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

  // get reviews for specific food truck id '/v1/foodtruck/reviews/:id'
  api.get('/reviews/:id', (req, res) => {
    Review.find({foodtruck: req.params.id}, (err, reviews) => {
      if(err) {
        res.send(err);
      }
      res.json(reviews);
    });
  });


  // UPDATE
  // update existing foodtruck '/v1/foodtruck/:id'
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
  // delete foodtruck & its reviews '/v1/foodtruck/:id'
  api.delete('/:id', (req, res) => {
    // first make sure id is provided
    FoodTruck.findById(req.params.id, (err, foodtruck) => {
      if(err) {
        res.status(500).send(err);
        return;
      }
      if(foodtruck === null) {
        res.status(404).send("FoodTruck Not Found");
        return;
      }
      FoodTruck.remove({
        _id: req.params.id
      }, (err, foodtruck) => {
        if(err) {
          res.status(500).send(err);
          return;
        }
        Review.remove({
          foodtruck: req.params.id
        }, (err, review) => {
          if(err) {
            res.send(err);
          }
          res.json({message: "FoodTruck and its Reviews Successfully Removed"});
        });
      });
    });
  });

  // Delete a specific review
  // '/v1/foodtruck/reviews/:id'
  api.delete('/reviews/:id', (req, res) => {
    // First find the review to remove
    Review.findById(req.params.id, (err, review) => {
      if (err) {
        res.send(err);
      }
      // Set a variable with the food truck id
      let id = review.foodtruck;
      // Get the food truck
      FoodTruck.findById(id, (err, truck) => {
        // Remove (pull) the review id from the reviews array
        truck.reviews.pull(review);
        // Save the truck with the removed array element
        truck.save(err => {
          if (err) {
            res.send(err);
          }
          // Finally remove the actual review
          Review.remove({
            _id: req.params.id
          }, (err, review) => {
            if (err) {
              res.send(err);
            }
            res.json({"message": "review successfully removed."});
          });
        });
      });
    });
  });

  return api;
}
