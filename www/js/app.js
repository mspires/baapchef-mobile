// 
// Here is how to define your module 
// has dependent on mobile-angular-ui
// 
var myapp = angular.module('myApp', [
  'ngRoute',
  'ngAnimate',
  'mobile-angular-ui',
  'ngCordova',
  
  // touch/drag feature: this is from 'mobile-angular-ui.gestures.js'
  // it is at a very beginning stage, so please be careful if you like to use
  // in production. This is intended to provide a flexible, integrated and and 
  // easy to use alternative to other 3rd party libs like hammer.js, with the
  // final pourpose to integrate gestures into default ui interactions like 
  // opening sidebars, turning switches on/off ..
  'mobile-angular-ui.gestures'
  //'angular-gestures'
]);

myapp.run(function($transform) {
  window.$transform = $transform;
});

// 
// You can configure ngRoute as always, but to take advantage of SharedState location
// feature (i.e. close sidebar on backbutton) you should setup 'reloadOnSearch: false' 
// in order to avoid unwanted routing.
// 
myapp.config(function($routeProvider/*, hammerDefaultOptsProvider*/) {
  $routeProvider.when('/',              {templateUrl: 'partial/home.html', reloadOnSearch: false});
  $routeProvider.when('/home',              {templateUrl: 'partial/home.html', reloadOnSearch: false});
  $routeProvider.when('/login',        {templateUrl: 'partial/login.html', reloadOnSearch: false}); 
  $routeProvider.when('/signup',        {templateUrl: 'partial/signup.html', reloadOnSearch: false});
  $routeProvider.when('/confirm',        {templateUrl: 'partial/confirm.html', reloadOnSearch: false});
  $routeProvider.when('/pay',        {templateUrl: 'partial/pay.html', reloadOnSearch: false}); 
  $routeProvider.when('/reload',        {templateUrl: 'partial/reload.html', reloadOnSearch: false}); 
  $routeProvider.when('/manage',        {templateUrl: 'partial/manage.html', reloadOnSearch: false}); 
  $routeProvider.when('/orders',        {templateUrl: 'partial/order.html', reloadOnSearch: false});
  $routeProvider.when('/additem',        {templateUrl: 'partial/additem.html', reloadOnSearch: false});
  $routeProvider.when('/addtakeoutitem',        {templateUrl: 'partial/addtakeoutitem.html', reloadOnSearch: false});
  $routeProvider.when('/orderview',        {templateUrl: 'partial/orderview.html', reloadOnSearch: false});
  $routeProvider.when('/takeoutorderview',        {templateUrl: 'partial/takeoutorderview.html', reloadOnSearch: false});
  $routeProvider.when('/receipt',        {templateUrl: 'partial/receipt.html', reloadOnSearch: false});
  $routeProvider.when('/rewards',        {templateUrl: 'partial/reward.html', reloadOnSearch: false});
  $routeProvider.when('/stores',        {templateUrl: 'partial/store.html', reloadOnSearch: false});
  $routeProvider.when('/messages',        {templateUrl: 'partial/message.html', reloadOnSearch: false});
  $routeProvider.when('/gift',        {templateUrl: 'partial/gift.html', reloadOnSearch: false});
  $routeProvider.when('/help',        {templateUrl: 'partial/help.html', reloadOnSearch: false});
  $routeProvider.when('/ad',        {templateUrl: 'partial/ad.html', reloadOnSearch: false});
  $routeProvider.when('/setting',        {templateUrl: 'partial/setting.html', reloadOnSearch: false});
  $routeProvider.when('/faq',        {templateUrl: 'partial/faq.html', reloadOnSearch: false});
  $routeProvider.when('/contact',        {templateUrl: 'partial/contact.html', reloadOnSearch: false});
  $routeProvider.when('/profile',        {templateUrl: 'partial/profile.html', reloadOnSearch: false});
  $routeProvider.when('/changepwd',        {templateUrl: 'partial/changepwd.html', reloadOnSearch: false});
  $routeProvider.when('/logout',        {templateUrl: 'partial/logout.html', reloadOnSearch: false});
  $routeProvider.when('/guide',        {templateUrl: 'partial/guide.html', reloadOnSearch: false});
  $routeProvider.when('/about',        {templateUrl: 'partial/about.html', reloadOnSearch: false});
  $routeProvider.when('/terms',        {templateUrl: 'partial/terms.html', reloadOnSearch: false});
  $routeProvider.when('/policy',        {templateUrl: 'partial/policy.html', reloadOnSearch: false});
  
  /*
  hammerDefaultOptsProvider.set({
      recognizers: [
        [Hammer.Tap,{ event: 'tap'}],        
        [Hammer.Tap, { event: 'doubletap', taps: 2 }, [], ['tap']],
        [Hammer.Swipe,{ event: 'swipe', time: 50}],
        [Hammer.Press],
        [Hammer.Pan]
      ]
  });
  */
  
});

// 
// `$touch example`
// 

myapp.directive('toucharea', ['$touch', function($touch){
  // Runs during compile
  return {
    restrict: 'C',
    link: function($scope, elem) {
      $scope.touch = null;
      $touch.bind(elem, {
        start: function(touch) {
          $scope.touch = touch;
          $scope.$apply();
        },

        cancel: function(touch) {
          $scope.touch = touch;  
          $scope.$apply();
        },

        move: function(touch) {
          $scope.touch = touch;
          $scope.$apply();
        },

        end: function(touch) {
          $scope.touch = touch;
          $scope.$apply();
        }
      });
    }
  };
}]);

//
// `$drag` example: drag to dismiss
//
myapp.directive('dragToDismiss', function($drag, $parse, $timeout){
  return {
    restrict: 'A',
    compile: function(elem, attrs) {
      var dismissFn = $parse(attrs.dragToDismiss);
      return function(scope, elem){
        var dismiss = false;

        $drag.bind(elem, {
          transform: $drag.TRANSLATE_RIGHT,
          move: function(drag) {
            if( drag.distanceX >= drag.rect.width / 4) {
              dismiss = true;
              elem.addClass('dismiss');
            } else {
              dismiss = false;
              elem.removeClass('dismiss');
            }
          },
          cancel: function(){
            elem.removeClass('dismiss');
          },
          end: function(drag) {
            if (dismiss) {
              elem.addClass('dismitted');
              $timeout(function() { 
                scope.$apply(function() {
                  dismissFn(scope);  
                });
              }, 300);
            } else {
              drag.reset();
            }
          }
        });
      };
    }
  };
});

//
// Another `$drag` usage example: this is how you could create 
// a touch enabled "deck of cards" carousel. See `carousel.html` for markup.
//
myapp.directive('carousel', function(){
  return {
    restrict: 'C',
    scope: {},
    controller: function() {
      this.itemCount = 0;
      this.activeItem = null;

      this.addItem = function(){
        var newId = this.itemCount++;
        this.activeItem = this.itemCount === 1 ? newId : this.activeItem;
        return newId;
      };

      this.next = function(){
        this.activeItem = this.activeItem || 0;
        this.activeItem = this.activeItem === this.itemCount - 1 ? 0 : this.activeItem + 1;
      };

      this.prev = function(){
        this.activeItem = this.activeItem || 0;
        this.activeItem = this.activeItem === 0 ? this.itemCount - 1 : this.activeItem - 1;
      };
    }
  };
});

myapp.directive('carouselItem', function($drag) {
  return {
    restrict: 'C',
    require: '^carousel',
    scope: {},
    transclude: true,
    template: '<div class="item"><div ng-transclude></div></div>',
    link: function(scope, elem, attrs, carousel) {
      scope.carousel = carousel;
      var id = carousel.addItem();
      
      var zIndex = function(){
        var res = 0;
        if (id === carousel.activeItem){
          res = 2000;
        } else if (carousel.activeItem < id) {
          res = 2000 - (id - carousel.activeItem);
        } else {
          res = 2000 - (carousel.itemCount - 1 - carousel.activeItem + id);
        }
        return res;
      };

      scope.$watch(function(){
        return carousel.activeItem;
      }, function(){
        elem[0].style.zIndex = zIndex();
      });
      
      $drag.bind(elem, {
        //
        // This is an example of custom transform function
        //
        transform: function(element, transform, touch) {
          // 
          // use translate both as basis for the new transform:
          // 
          var t = $drag.TRANSLATE_BOTH(element, transform, touch);
          
          //
          // Add rotation:
          //
          var Dx    = touch.distanceX, 
              t0    = touch.startTransform, 
              sign  = Dx < 0 ? -1 : 1,
              angle = sign * Math.min( ( Math.abs(Dx) / 700 ) * 30 , 30 );
          
          t.rotateZ = angle + (Math.round(t0.rotateZ));
          
          return t;
        },
        move: function(drag){
          if(Math.abs(drag.distanceX) >= drag.rect.width / 4) {
            elem.addClass('dismiss');  
          } else {
            elem.removeClass('dismiss');  
          }
        },
        cancel: function(){
          elem.removeClass('dismiss');
        },
        end: function(drag) {
          elem.removeClass('dismiss');
          if(Math.abs(drag.distanceX) >= drag.rect.width / 4) {
            scope.$apply(function() {
              carousel.next();
            });
          }
          drag.reset();
        }
      });
    }
  };
});

myapp.directive('dragMe', ['$drag', function($drag){
  return {
    controller: function($scope, $element) {
      $drag.bind($element, 
        {
          //
          // Here you can see how to limit movement 
          // to an element
          //
          transform: $drag.TRANSLATE_INSIDE($element.parent()),
          end: function(drag) {
            // go back to initial position
            drag.reset();
          }
        },
        { // release touch when movement is outside bounduaries
          sensitiveArea: $element.parent()
        }
      );
    }
  };
}]);


myapp.directive("elementGlow", function ($animate)
{
    // Initialization
	var unwatchProperty = null;

	// Definition object
	return {
		// Post-link function
	  link: function (scope, element, attrs)
	  {
	    var watchedProperty = attrs.elementGlow;
	
	    if (watchedProperty !== undefined && watchedProperty !== "")
	    {
	      unwatchProperty = scope.$watch(watchedProperty,
	        function (newVal, oldVal, scope)
	        {
	          if (newVal !== oldVal)
	          {
	            if (newVal)
	            {
	              $animate.animate(element,
	                {
	                  "box-shadow": "none"
	                },
	                {
	                  "box-shadow": "0px 0px 15px 5px rgba(135, 206, 250, 0.75)"
	                },
	                "element-glow-animation"
	              );
	            }
	            else
	            {
	              $animate.animate(element,
	                {
	                  "box-shadow": "0px 0px 15px 5px rgba(135, 206, 250, 0.75)"
	                },
	                {
	                  "box-shadow": "none"
	                },
	                "element-glow-animation"
	              );
	            }
	          }
	        });
	
	      element.one("$destroy",
	        function ()
	        {
	          // Directive cleanup
	              if (unwatchProperty !== null)
	              {
	                unwatchProperty();
	
	                unwatchProperty = null;
	              }
	            });
	        }
	      }
	    };
})
//
// For this trivial demo we have just a unique MainController 
// for everything
//
myapp.controller('MainController', function($rootScope, $scope, $location, $filter, $http, $animate, $q,
		$cordovaCamera, $cordovaGeolocation, $cordovaLocalNotification,	$cordovaToast){

	$scope.rooturl = "http://www.baapchef.com";
	
	$scope.rid = 0;
	$scope.cid = 0;
	
	$scope.filters = {};
	$scope.takeoutfilters = {};
	$scope.dishes = [];
	$scope.takeoutes = [];
	$scope.selectedgroup = [];
	
	$scope.lastselected = {};
	$scope.orderitems = [];
	
    $scope.unittax = 0.0;
    $scope.subtotal = 0.0;
    $scope.tax = 0.0;
    $scope.total = 0.0;	
    
    $scope.customer = {};
    
    $scope.selectedorder = {};
	
    $scope.loginST = {'loggedin': false, 'email': 'demo@customer.com', 'password': '12345678', 'remember': false};
    $scope.signupST = {'name': '', 'email': '', 'tel': '', 'password': '', 'confirmpassword': ''};
    $scope.changepwdST = {'email': '', 'password': '', 'npassword': '' , 'cpassword': ''};
    $scope.contactST = {'subject': '', 'note': ''};
    	
	$scope.faqs = [];
	
	var start = function() {
		
        $http({
            url: 'partial/faq/faq.json',
            method: "POST",
            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        })
        .success(function(data, status, headers, config) {
	
        	$scope.faqs = data;
        	//navigator.geolocation.getCurrentPosition($scope.onSuccess);
        	
        }); 
        
	    $http({
	        url: $scope.rooturl + '/customer/takeoutdish/takeout',
	        method: "POST",
	        headers: {'Content-Type': 'application/x-www-form-urlencoded'}
	    })
	    .success(function(data, status, headers, config) {
	
	    	$scope.takeoutes = data.dishes;
	    	if($scope.takeoutes.length > 0) {
	    	
	    		$scope.unittax = parseFloat($scope.takeoutes[0].tax) / 100;
	    		$scope.takeoutfilters.price = '8.00';
	    	}
	    	
	    }); 
                
	}
	
	start();
	
	/*
	$scope.onSuccess = function(position) {
	
		alert(position.coords.latitude);
	}
	*/
	/*
	var posOptions = {timeout: 10000, enableHighAccuracy: false};
	$cordovaGeolocation.getCurrentPosition(posOptions).then(function (position) {
	      var lat  = position.coords.latitude
	      var long = position.coords.longitude
	    }, function(err) {
	      // error
	    });

	*/
	var watchOptions = {timeout : 3000,enableHighAccuracy: false};

	var watch = $cordovaGeolocation.watchPosition(watchOptions);
	watch.then(null,
	    function(err) {
	      // error
	    },
	    function(position) {
	      var lat  = position.coords.latitude
	      var long = position.coords.longitude
	      //alert(lat);
	    });
	

	$scope.imgSrc="";
 
    $scope.takePicture = function() {

    	var options = {
                quality: 50,
                destinationType: Camera.DestinationType.DATA_URL,
                sourceType: Camera.PictureSourceType.CAMERA,
                allowEdit: true,
                encodingType: Camera.EncodingType.JPEG,
                targetWidth: 100,
                targetHeight: 100,
                popoverOptions: CameraPopoverOptions,
                saveToPhotoAlbum: false
        };    	

    	/*
    	$scope.imgSrc = "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";

    	
        $http({
        	url: $scope.rooturl + '/customer/profile/upload',
            method: "POST",
            data:{'cid': '10000', 'imgsrc': $scope.imgSrc},
            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        })
        .success(function(data, status, headers, config) {
	
        	
        }); 
        */


    	$cordovaCamera.getPicture(options).then(function(imageData) {
    	
            $http({
            	url: $scope.rooturl + '/customer/profile/upload',
                method: "POST",
                data:{'cid': '10000', 'imgsrc': imageData},
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            })
            .success(function(data, status, headers, config) {
    	
            	
            }); 
    		
        }, function(err) {
            console.log(err);
        });
        
    }

    /*
    $scope.type = '--';
    $scope.handleGesture = function($event) {
      console.log('button event', $event);
      $scope.type = $event.type;
      $event.srcEvent.stopPropagation();
    };
    $scope.handleParentGesture = function($event) {
      console.log('parent event', $event);
      $scope.type = $event.type;
    };    
    */
    
    $scope.refreshtakeout = function(price) {
    	
	    $http({
	        url: $scope.rooturl + '/customer/takeoutdish/takeout',
	        method: "POST",
	        headers: {'Content-Type': 'application/x-www-form-urlencoded'}
	    })
	    .success(function(data, status, headers, config) {
	
	    	$scope.takeoutes = [];
	    	$scope.takeoutes = data.dishes;
	    	if($scope.takeoutes.length > 0) {
	    	
	    		$scope.unittax = parseFloat($scope.takeoutes[0].tax) / 100;
	    		$scope.takeoutfilters.price = price;
	    	}
	    	
	    }); 
    }
    
        
	$scope.load = function() {
        console.log('call load()...');
        
        $http({
            url: $scope.rooturl + '/customer/dish/menu',
            method: "POST",
            data:{'rid': '10000'},
            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        })
        .success(function(data, status, headers, config) {
	
        	$scope.unittax = parseFloat(data.restaurant.tax) / 100;
        	
        	$scope.restaurant = data.restaurant;
        	$scope.dishes = data.dishes;
        	$scope.dishgroups = data.dishgroups;
        	
        }); 
        
        $http({
            url: $scope.rooturl + '/customer/reward/item',
            method: "POST",
            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        })
        .success(function(data, status, headers, config) {
	
        	$scope.rewards = data.rewards;
        });         

        $http({
            url: $scope.rooturl + '/customer/message/msg',
            method: "POST",
            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        })
        .success(function(data, status, headers, config) {
	
        	$scope.msgs = data;
        	$scope.messages = $scope.msgs.messages;
        });         
        
    }
	
	$scope.changeMessage = function(idx) {
	
		if(idx == 0) {
			$scope.messages = $scope.msgs.messages;
		}
		else if(idx == 1) {
			$scope.messages = $scope.msgs.events;
		}
		else {
			$scope.messages = $scope.msgs.alerts;
		}
	
	}
    
    $scope.isForStart = function() {
    	
    	if($scope.loginST.loggedin) {
    		
	    	if(!($scope.isActive('/orders') || $scope.isActive('/additem') || $scope.isActive('/orderview'))) {
	    		
	    		return true;
	    	}
    	}	
    	return false;	
    };    
    
    $scope.isForBeforeStart = function() {
    	return !$scope.loginST.loggedin;
    };    

    $scope.isForOrder = function() {
    	
    	if($scope.loginST.loggedin) {
    		
    		if($scope.isActive('/orders') || $scope.isActive('/additem') || $scope.isActive('/orderview'))
    			return true;
    	}
        return false;	
    }; 
    
    $scope.isActive = function(path) {
    	
    	if ($location.path().substr(0, path.length) === path) {
    	    return true;
    	}
    	else if (path === '/home' && $location.path() === '/') {
    	    return true;
    	}
    	 
    	return false;	
    };
  
    
    var aditems = [];

    aditems.push('partial/ad/ad1.png');
    aditems.push('partial/ad/ad2.png');
    aditems.push('partial/ad/ad3.png');

    $scope.currentad = 0;
    $scope.adimg = aditems[0];
    $scope.selection = "";

    $scope.swiped = function(direction) {
	  
    	if( direction == 'LEFT') {
    		$scope.selection = "nope";
    	}
    	else if( direction == 'RIGHT') {
    		$scope.selection = "like";
    	}
    	else if( direction == 'TOP') {
    		$scope.selection = "superlike";
    	}
      
      if( direction == 'LEFT' || direction == 'RIGHT' || direction == 'TOP')
	  {
		  $scope.currentad++;
		  if($scope.currentad > 2)
			  $scope.currentad = 0;
		  
		  $scope.adimg = aditems[$scope.currentad];
	  }
	  if( direction == 'BOTTOM')
	  {
		  $scope.currentad--;
		  if($scope.currentad < 0)
			  $scope.currentad = 2;
		  
		  $scope.adimg = aditems[$scope.currentad];
	  }
    };

  $scope.showToast = function(subject) {
      $cordovaToast
          .show(subject, 'short', 'bottom');
  }

  $scope.notify = function(title, text) {
      $cordovaLocalNotification.add({
          id: 'baapchef_notif',
          title: title,
          text: text
      }).then(function() {
          console.log('notification fired');
      });
  };
 
  
  $scope.changegroup = function(dishgroupid) {
	  
	  var dishgroup = getById($scope.dishgroups, dishgroupid);
	  
	  $scope.selectedgroup = dishgroup; 
	  $scope.filters.groupid = selectedgroup.id;
	  
	  //$location.path('/orders');
  }
  
  $scope.additem = function(dishid) {
	  
		var dish = getById($scope.dishes, dishid);
			  
		$scope.lastselected = dish;
		
		orderitem = dish;
		orderitem.qty = 1;
		$scope.orderitems.push(orderitem);
		
		$scope.subtotal = parseFloat($scope.subtotal) + parseFloat(dish.price);
		$scope.tax = $scope.subtotal * $scope.unittax;
		$scope.total = $scope.subtotal + $scope.tax;
		
		$scope.showToast(dish.name + ' is added');
		
		$location.path('/additem');
  }
  
  $scope.deleteitem = function(dishid, back) {
	  
		var dish = getById($scope.orderitems, dishid);
		var index = $scope.orderitems.indexOf(dish);
		$scope.orderitems.splice(index, 1); 
		
		$scope.subtotal = parseFloat($scope.subtotal) - parseFloat(dish.price);
	  	$scope.tax = $scope.subtotal * $scope.unittax;
	  	$scope.total = $scope.subtotal + $scope.tax;
	  	
	  	$scope.showToast(dish.name + ' is removed');
	  	
	  	if(back) {
	  		$location.path('/orders');
	  	}
  }

  $scope.addtakeoutitem = function(dishid) {
	  
		var dish = getById($scope.takeoutes, dishid);
		$scope.lastselected = dish;
		
		orderitem = dish;
		orderitem.qty = 1;
		$scope.orderitems.push(orderitem);
		
		$scope.subtotal = parseFloat($scope.subtotal) + parseFloat(dish.price);
		$scope.tax = $scope.subtotal * $scope.unittax;
		$scope.total = $scope.subtotal + $scope.tax;
		
		$scope.restaurantid = dish.rid;
		
		$scope.showToast(dish.name + ' is selected');

		$location.path('/addtakeoutitem');
  }
  
  $scope.deletetakeoutitem = function(dishid) {
	  
		var dish = getById($scope.orderitems, dishid);
		var index = $scope.orderitems.indexOf(dish);
		$scope.orderitems.splice(index, 1); 
		
		$scope.subtotal = parseFloat($scope.subtotal) - parseFloat(dish.price);
	  	$scope.tax = $scope.subtotal * $scope.unittax;
	  	$scope.total = $scope.subtotal + $scope.tax;
	  	
	  	$scope.showToast(dish.name + ' is removed');
	  	
	  	$location.path('/home');
  }  
  
  $scope.makeOrder = function() {
  	
	  if(!$scope.loginST.loggedin) {
		  
		  alert("Please login first.")
		  $location.path('/login');
	  }
	  else
	  {
	  	  if($scope.orderitems.length > 0) {
	  
	  		if(confirm('Are you sure to order now?') == true) {
	  		
	  			$http({
	        		url: $scope.rooturl + '/customer/order/ordernow',
	                method: "POST",
	                data: { cid : $scope.cid, rid : $scope.rid, orderitems : $scope.orderitems },
	                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
	            })            
	            
	            .success(function(data, status, headers, config) {
	          	  	
	            	$scope.orderitems = [];
	            	$scope.selectedorder = data.data;
	            	
	            	$scope.notify('order item','order is completed')
	            	
	            	$location.path('/receipt');
	            })
	            .error(function(data, status, headers, config) {
	            });
	  		}
	    }
	  	else
	  	{
	  		alert('No dishes are selected now.');
	  	}
	  }
  }
  
  $scope.login = function() {

	  if($scope.loginST.email == '' || $scope.loginST.password == '') {
		  
		  return;
	  }
	  
	  $http({
          url: $scope.rooturl + '/customer/auth/logindo',
          method: "POST",
          data:{'email': $scope.loginST.email, 'password': $scope.loginST.password},
          headers: {'Content-Type': 'application/x-www-form-urlencoded'}
      })
      .success(function(data, status, headers, config) {
      
    	  $scope.changepwdST.email = $scope.loginST.email;
    	  $scope.loginST.loggedin = true;
    	  
    	  $scope.customer = data.customer;
    	  $scope.load();
      });        
      
	  
	  
	  /*
	  cordova.plugins.notification.local.hasPermission(function(granted){
		
		  if(granted == false)
		  {
			  navigator.notification.alert("Reminder cannot be added because app  doesn't have permission");  
		  }
		  else{
			  navigator.notification.alert("Reminder cannot be added because app  have permission");  
					  
		  }
		  
	  
	  });
	  */
	  $location.path('/home');
  }

  $scope.logout = function() {
	    
	  $scope.loginST.loggedin = false;   // to toggle display of SignUp/Logout
	  $scope.loginST.email = "";
	  $scope.loginST.password = "";

	  $location.path('/');       // redirect to home page after logout
  }  
  
  $scope.signup = function() {

	  if($scope.signupST.password != $scope.signupST.confirmpassword ) {
		  
		  return;
	  }
	  $http({
          url: $scope.rooturl + '/customer/auth/signupdo',
          method: "POST",
          data:{'name': $scope.signupST.name, 'email': $scope.signupST.email, 'phone': $scope.signupST.tel, 'password': $scope.signupST.password},
          headers: {'Content-Type': 'application/x-www-form-urlencoded'}
      })
      .success(function(data, status, headers, config) {
	
      	
      });        
      
	  //$location.path('/home');
  }
  
  $scope.changepwd = function() {

	  if($scope.changepwdST.email == '' || $scope.changepwdST.opassword == '' || 
			  $scope.changepwdST.npassword == '' || $scope.changepwdST.cpassword == '' ) {
		  return;
	  }
	  if($scope.changepwdST.npassword != $scope.changepwdST.cpassword ) {
		  
		  return;
	  }
	  
	  $http({
          url: $scope.rooturl + '/customer/auth/changepwddo',
          method: "POST",
          data:{'email': $scope.changepwdST.email, 'oldpwd': $scope.changepwdST.opassword, 'confirmpwd': $scope.changepwdST.cpassword},
          headers: {'Content-Type': 'application/x-www-form-urlencoded'}
      })
      .success(function(data, status, headers, config) {
    	  $location.path('/setting');
      });        
  }
  
  $scope.contact = function() {

	  /*
      $http({
          url: $scope.rooturl + '/customer/contact',
          method: "POST",
          data:{'rid': '10000'},
          headers: {'Content-Type': 'application/x-www-form-urlencoded'}
      })
      .success(function(data, status, headers, config) {
	
      	$scope.unittax = parseFloat(data.restaurant.tax) / 100;
      	
      	$scope.restaurant = data.restaurant;
      	$scope.dishes = data.dishes;
      	$scope.dishgroups = data.dishgroups;
      	
      });        
      */
	  $location.path('/home');
  }
  
	$scope.getSubTotal = function(){
	    var total = 0;
	    for(var i = 0; i < $scope.selectedorder.orderitems.length; i++){
	        var item = $scope.selectedorder.orderitems[i];
	        total += (item.price * item.qty);
	    }
	    return total;
	}
	
	$scope.getTax = function(){
	    var total = 0;
	    for(var i = 0; i < $scope.selectedorder.orderitems.length; i++){
	        var item = $scope.selectedorder.orderitems[i];
	        total += (item.price * item.qty);
	    }
	    return total * ($scope.restaurant.tax /100);
	}
	
	$scope.getTotal = function(){
	    var total = 0;
	    for(var i = 0; i < $scope.selectedorder.orderitems.length; i++){
	        var item = $scope.selectedorder.orderitems[i];
	        total += (item.price * item.qty);
	    }
	    return total + total * ($scope.restaurant.tax /100);
	}
  
  // User agent displayed in home page
  $scope.userAgent = navigator.userAgent;
  
  // Needed for the loading screen
  $rootScope.$on('$routeChangeStart', function(){
    $rootScope.loading = true;
  });

  $rootScope.$on('$routeChangeSuccess', function(){
    $rootScope.loading = false;
  });

  // Fake text i used here and there.
  $scope.lorem = 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Vel explicabo, aliquid eaque soluta nihil eligendi adipisci error, illum corrupti nam fuga omnis quod quaerat mollitia expedita impedit dolores ipsam. Obcaecati.';

  // 
  // 'Scroll' screen
  // 
  var scrollItems = [];

  for (var i=1; i<=100; i++) {
    scrollItems.push('Item ' + i);
  }

  $scope.scrollItems = scrollItems;

  $scope.bottomReached = function() {
    /* global alert: false; */
    alert('Congrats you scrolled to the end of the list!');
  };

  // 
  // 'Drag' screen
  // 
  $scope.notices = [];
  
  for (var j = 0; j < 10; j++) {
    $scope.notices.push({icon: 'envelope', message: 'Notice ' + (j + 1) });
  }

  $scope.deleteNotice = function(notice) {
    var index = $scope.notices.indexOf(notice);
    if (index > -1) {
      $scope.notices.splice(index, 1);
    }
  };
  
  
  function getById(arr, id) {
      for (var d = 0, len = arr.length; d < len; d += 1) {
          if (arr[d].id === id) {
              return arr[d];
          }
      }
  } 
  
  	$scope.swiped2 = function (direction)
  	{
		var like = document.querySelector("#like");
		var superlike = document.querySelector("#superlike");
		var nope = document.querySelector("#nope");
		
		if (like !== null && superlike !== null && nope !== null)
		{
	    	if( direction == 'LEFT') {
	    		selection = angular.element(nope);
	    	}
	    	else if( direction == 'RIGHT') {
	    		selection = angular.element(like);
	    	}
	    	else if( direction == 'TOP') {
	    		selection = angular.element(superlike);
	    	}

			$animate.addClass(selection, "custom-class").then(function () {
      
				$animate.removeClass(selection, "custom-class").then(function () {
  
				      if( direction == 'LEFT' || direction == 'RIGHT' || direction == 'TOP')
					  {
						  $scope.currentad++;
						  if($scope.currentad > 2)
							  $scope.currentad = 0;
						  
						  $scope.adimg = aditems[$scope.currentad];
					  }
					  if( direction == 'BOTTOM')
					  {
						  $scope.currentad--;
						  if($scope.currentad < 0)
							  $scope.currentad = 2;
						  
						  $scope.adimg = aditems[$scope.currentad];
					  }
				});
			});			
		}
  	};

});