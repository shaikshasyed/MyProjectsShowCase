import {Component} from 'react'
import Loader from 'react-loader-spinner'
import ProjectItem from '../ProjectItem'
import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

const categoriesList = [
  {id: 'ALL', displayText: 'All'},
  {id: 'STATIC', displayText: 'Static'},
  {id: 'RESPONSIVE', displayText: 'Responsive'},
  {id: 'DYNAMIC', displayText: 'Dynamic'},
  {id: 'REACT', displayText: 'React'},
]

class Projects extends Component {
  state = {
    projectList: [],
    activeCategoryId: categoriesList[0].id,
    apiStatus: apiStatusConstants.initial,
  }

  componentDidMount() {
    this.getProjectList()
  }

  onChangeCategory = event => {
    this.setState(
      {
        activeCategoryId: event.target.value,
      },
      this.getProjectList,
    )
  }

  onClickRetryButton = () => {
    this.getProjectList()
  }

  getProjectList = async () => {
    this.setState({
      apiStatus: apiStatusConstants.inProgress,
    })

    const {activeCategoryId} = this.state

    const url = `https://apis.ccbp.in/ps/projects?category=${activeCategoryId}`
    const options = {
      method: 'GET',
    }
    const response = await fetch(url, options)
    const data = await response.json()

    if (response.ok === true) {
      const updatedData = data.projects.map(project => ({
        id: project.id,
        name: project.name,
        imageUrl: project.image_url,
      }))
      this.setState({
        projectList: updatedData,
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({
        apiStatus: apiStatusConstants.failure,
      })
    }
  }

  renderSuccessView = () => {
    const {projectList, activeCategoryId} = this.state
    return (
      <div className="projects-container">
        <div className="input-container">
          <select
            className="select-element"
            value={activeCategoryId}
            onChange={this.onChangeCategory}
          >
            {categoriesList.map(eachCategory => (
              <option key={eachCategory.id} value={eachCategory.id}>
                {eachCategory.displayText}
              </option>
            ))}
          </select>
        </div>
        <ul className="project-list">
          {projectList.map(each => (
            <ProjectItem key={each.id} projectDetails={each} />
          ))}
        </ul>
        <div className="display">
          <p>
            This Website is Designed for DeskTop View.Please Open in DeskTop for
            Better User Experience
          </p>
        </div>
      </div>
    )
  }

  renderLoaderView = () => (
    <div data-testid="loader" className="loader-container">
      <Loader type="ThreeDots" color="#4656a1" height={50} width={50} />
    </div>
  )

  renderFailureView = () => (
    <div className="failure-view-container">
      <img
        className="failure-view-image"
        src="https://assets.ccbp.in/frontend/react-js/projects-showcase/failure-img.png"
        alt="failure view"
      />
      <h1 className="failure-view-heading">Oops! Something Went Wrong</h1>
      <p className="failure-view-description">
        We cannot seem to find the page you are looking for.
      </p>
      <button
        type="button"
        className="retry-button"
        onClick={this.onClickRetryButton}
      >
        Retry
      </button>
    </div>
  )

  render() {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case apiStatusConstants.inProgress:
        return this.renderLoaderView()

      case apiStatusConstants.failure:
        return this.renderFailureView()

      case apiStatusConstants.success:
        return this.renderSuccessView()
      default:
        return null
    }
  }
}
export default Projects
