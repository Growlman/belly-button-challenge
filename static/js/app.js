//immutable url variable
const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json"

d3.json(url).then(function(data) {

    console.log(data);
});

//initailize the dashboard
function init() {
    let dropdownMenu = d3.select("#selDataset");
  
    d3.json(url).then((data) => {
      let names = data.names;
  
      names.forEach((id) => {
        console.log(id);
        dropdownMenu.append("option").text(id).property("value", id);
      });
  
      //set the first sample from the list
      let sample1 = names[0];
  
      console.log(sample1);
  
      //build the initial plots
      buildMetadata(sample1);
      buildBarChart(sample1);
      buildBubbleChart(sample1);
    });
  }
  
  //populate metadata info
  function buildMetadata(sample) {
    d3.json(url).then((data) => {
      let metadata = data.metadata;
      let value = metadata.filter((result) => result.id == sample);
      console.log(value);
  
      let valueData = value[0];
  
      d3.select("#sample-metadata").html("");
      Object.entries(valueData).forEach(([key, value]) => {
        //log the individual key/value pairs as they are being appended to the metadata panel
        console.log(key, value);
        d3.select("#sample-metadata").append("h5").text(`${key}: ${value}`);
      });
    });
  }
  
  //build the bar chart
  function buildBarChart(sample) {
    d3.json(url).then((data) => {
      let sampleInfo = data.samples;
      let value = sampleInfo.filter((result) => result.id == sample);
      let valueData = value[0];
  
      let otu_ids = valueData.otu_ids;
      let otu_labels = valueData.otu_labels;
      let sample_values = valueData.sample_values;
  
      //log data to console
      console.log(otu_ids, otu_labels, sample_values);
  
      //slice data to top ten items in descending order
     
      let yticks = otu_ids.slice(0,10).map((id) => `OTU ${id}`).reverse();
      
      let xticks = sample_values.slice(0,10).reverse();
      
      let labels = otu_labels.slice(0,10).reverse();
  
      //set up the trace for the bar chart
      
      let traceB = {
        x: xticks,
        y: yticks,
        text: labels,
        type: "bar",
        orientation: "h",
      };
  
      let layout = {
        title: "Top 10 OTUs Present",
      };
  
      Plotly.newPlot("bar", [traceB], layout);
    });
  }
  // Function that builds the bubble chart
  function buildBubbleChart(sample) {
    // Use D3 to retrieve all of the data
    d3.json(url).then((data) => {
      
      let sampleInfo = data.samples;
  
      // Filter based on the value of the sample
      let value = sampleInfo.filter((result) => result.id == sample);
  
      // Get the first index from the array
      let valueData = value[0];
  
      // Get the otu_ids, lables, and sample values
      let otu_ids = valueData.otu_ids;
      let otu_labels = valueData.otu_labels;
      let sample_values = valueData.sample_values;
  
      // Log the data to the console
      console.log(otu_ids, otu_labels, sample_values);
  
      //trace for bubble chart
      let trace1 = {
        x: otu_ids,
        y: sample_values,
        text: otu_labels,
        mode: "markers",
        marker: {
          size: sample_values,
          color: otu_ids,
          colorscale: "Portland"
        }
    };
    //was not able to get the displayed bubbles to look like the presented example
    //using the otu_ids, so put a fun portland color scale on it

      //layout
      let layout = {
        title: "Bacteria Per Sample",
        hovermode: "closest",
        xaxis: {title: "OTU ID"},
      };
  
      // Plotly to plot the bubble chart
      Plotly.newPlot("bubble", [trace1], layout);
    });
  };
  
  // Function that updates dashboard when sample is changed
  function optionChanged(value) {
    // Log the new value
    console.log(value);
  
    // Call all functions
    buildMetadata(value);
    buildBarChart(value);
    buildBubbleChart(value);
  };
  
  //initialize
  init();