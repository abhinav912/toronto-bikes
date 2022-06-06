import React from "react";
import ContentLoader from 'react-content-loader'

const BikesLoader = () => (
    <ContentLoader viewBox="0 0 380 70">  
      <rect x="30" y="15" rx="4" ry="3" width="300" height="13" />
      <rect x="30" y="35" rx="4" ry="3" width="300" height="13" />
      <rect x="30" y="55" rx="4" ry="3" width="300" height="13" />
    </ContentLoader>
  )

class Bikes extends React.Component {
    // Constructor 
    constructor(props) {
        super(props);
   
        this.state = {
            items: [],
            DataisLoaded: false,
            bikesAvailability: [],
            allItems: []
        };
        this.getBikesData = this.getBikesData.bind(this);
    }



    filterUpdate(){
        const { items,allItems } = this.state;
        
        var searchItem = document.getElementById('searchField').value;
        var sortedItems = allItems.filter((station) => {
            return station.name.toLowerCase().indexOf(searchItem.toLowerCase()) > -1        });
        if(searchItem == ''){
            sortedItems = allItems ;
        }
        this.setState({
            items: sortedItems
        });

    }

    getBikesData(){
        this.setState({
            DataisLoaded: false
        });
        fetch("https://toronto-us.publicbikesystem.net/ube/gbfs/v1/en/station_information")
        .then((res) => res.json())
        .then((json) => {
            this.setState({
                items: json.data.stations,
                allItems: json.data.stations,
                DataisLoaded: true
            });
        });
    }

    getAvailabilyData() {
        fetch("https://toronto-us.publicbikesystem.net/ube/gbfs/v1/en/station_status")
        .then((res) => res.json())
        .then((json) => {
            this.setState({
                bikesAvailability: json.data.stations
            });
        }); 
    }

    componentDidMount() {
        this.getBikesData();
        this.getAvailabilyData();

        setInterval(() => {
            this.getAvailabilyData();
        },30000);

    }

    render() {
        const { DataisLoaded, items, bikesAvailability } = this.state;
        if (!DataisLoaded){ return <div>
                {BikesLoader()}
            </div> ;
        }else{
            return (
                <div className="container mt-4">
                    <nav className="navbar navbar-light  justify-content-between">
                    <p className="text-primary" onClick={this.getBikesData}><i className="bi bi-arrow-repeat"></i>Reload</p>
                    <input className="form-control mr-sm-2 search-field" id="searchField" type="search" placeholder="Search Station Name" aria-label="Search" onChange = { () => { this.filterUpdate();}} />
                </nav>
                    <div className="row">
                        {
                            items.map((item) => ( 
                                <div className="col-md-4 mt-4" key = { item.station_id }>
                                    <div className="card" >
                                        <div className="card-body">
                                            <h5 className="card-title">{ item.name }</h5><hr />
                                            {bikesAvailability.map((bikeAvailability) => {
                                                if(bikeAvailability.station_id === item.station_id){
                                                    return (
                                                        <div className="card-text" key="bikeAvailability.station_id">
                                                        <p><b>Bikes Available:</b><span>{bikeAvailability.num_bikes_available}</span></p>
                                                        <p><b>Mechanical Bikes:</b><span>{bikeAvailability.num_bikes_available_types.mechanical}</span></p>
                                                        <p><b>eBikes:</b><span>{bikeAvailability.num_bikes_available_types.ebike}</span></p>
                                                        <p><b>Status:</b><span>{bikeAvailability.status}</span></p>
                                                        </div>
                                                    )
                                                }
                                            })}
                                        </div>
                                    </div>
                                </div> 
                            ))
                        }
                    </div>
                </div>
            );
        }
    }
}

export default Bikes;