import './index.css'

const ProjectItem = props => {
  const {projectDetails} = props
  const {name, imageUrl} = projectDetails

  return (
    <li className="project-item">
      <img src={imageUrl} alt={name} className="project-image" />
      <div className="content">
        <p className="project-name">{name}</p>
      </div>
    </li>
  )
}

export default ProjectItem
